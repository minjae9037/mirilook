import { timingSafeEqual } from "node:crypto";
import { getHairMoneyProductFromNativeProductId } from "@/lib/mirilook-payments";
import { readServerEnv } from "@/lib/server/env";
import { creditHairMoneyForPayment } from "@/lib/server/hair-money";
import { recordPaymentEvent } from "@/lib/server/payment-events";
import { protectMutationRequest } from "@/lib/server/request-security";
import { getVerifiedSupabaseUser } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 30;

// 안드로이드 앱 인앱결제(Google Play) 적립 엔드포인트.
//
// 두 경로가 같은 엔드포인트로 들어온다:
//   A) 앱 클라이언트 직접 POST — 구매 직후 즉시 적립 (Supabase Bearer 토큰)
//   B) RevenueCat 웹훅 — A가 유실됐을 때의 안전망 (고정 Authorization 헤더)
//
// 멱등성은 DB가 보장한다: hair_money_ledger의 unique(profile_id, source_type, source_id)와
// credit_hair_money RPC의 on conflict do nothing 덕분에, A와 B가 둘 다 도착해도
// 두 번째는 applied=false, reason='already_applied'로 떨어지고 잔액은 변하지 않는다.
// 멱등 키(source_id) = Google Play 트랜잭션 id.

type ClientGrantPayload = {
  productId?: string; // 구글 product id (예: hair_money_2000)
  transactionId?: string; // Google Play 트랜잭션 id (예: GPA.1234-...)
};

type RevenueCatWebhookPayload = {
  event?: {
    app_user_id?: string; // = Supabase profile id (Purchases.logIn에 넣은 값)
    id?: string; // RevenueCat 이벤트 id
    product_id?: string;
    store?: string; // "PLAY_STORE"
    transaction_id?: string;
    type?: string; // "NON_RENEWING_PURCHASE" 등
  };
};

type GrantResult = {
  applied: boolean;
  balance: number | null;
  httpStatus?: number;
  reason?: string;
};

export async function POST(request: Request) {
  const securityError = protectMutationRequest(request, {
    maxBodyBytes: 32 * 1024,
    rateLimit: { key: "payments:iap-grant", limit: 60, windowMs: 10 * 60 * 1000 },
  });

  if (securityError) {
    return securityError;
  }

  const rawBody = await request.text();
  const authHeader = request.headers.get("authorization") ?? "";
  const webhookSecret = readServerEnv("REVENUECAT_WEBHOOK_AUTH");

  // ── 경로 B: RevenueCat 웹훅 ─────────────────────────────────────────────
  if (webhookSecret && matchesWebhookSecret(authHeader, webhookSecret)) {
    let payload: RevenueCatWebhookPayload;

    try {
      payload = JSON.parse(rawBody) as RevenueCatWebhookPayload;
    } catch {
      return Response.json({ error: "invalid_payload" }, { status: 400 });
    }

    const event = payload.event;

    // 소모성 구매 이외 이벤트(TEST/TRANSFER 등)는 조용히 수락 — 오적립 방지.
    if (!event || event.type !== "NON_RENEWING_PURCHASE") {
      return Response.json({ accepted: true, skipped: event?.type ?? "no_event" });
    }

    if (event.store && event.store !== "PLAY_STORE") {
      return Response.json({ accepted: true, skipped: `store:${event.store}` });
    }

    const grant = await grantIapCredit({
      googleProductId: event.product_id ?? "",
      profileId: event.app_user_id ?? "",
      revenuecatEventId: event.id ?? null,
      transactionId: event.transaction_id ?? "",
      via: "revenuecat_webhook",
    });

    // 웹훅은 5xx를 받으면 RevenueCat이 재시도한다 — 일시적 오류만 5xx로 돌려준다.
    return Response.json(grant, { status: grant.httpStatus ?? 200 });
  }

  // ── 경로 A: 앱 클라이언트 직접 POST ────────────────────────────────────
  const user = await getVerifiedSupabaseUser(request);

  if (!user) {
    return Response.json(
      { applied: false, balance: null, reason: "not_authenticated" },
      { status: 401 },
    );
  }

  let payload: ClientGrantPayload;

  try {
    payload = JSON.parse(rawBody) as ClientGrantPayload;
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const transactionId =
    typeof payload.transactionId === "string"
      ? payload.transactionId.trim().slice(0, 140)
      : "";
  const googleProductId =
    typeof payload.productId === "string" ? payload.productId.trim() : "";

  if (!transactionId || !googleProductId) {
    return Response.json(
      { error: "transactionId and productId required" },
      { status: 400 },
    );
  }

  const grant = await grantIapCredit({
    googleProductId,
    profileId: user.id,
    revenuecatEventId: null,
    transactionId,
    via: "client_post",
  });

  return Response.json(grant, { status: grant.httpStatus ?? 200 });
}

async function grantIapCredit({
  googleProductId,
  profileId,
  revenuecatEventId,
  transactionId,
  via,
}: {
  googleProductId: string;
  profileId: string;
  revenuecatEventId: string | null;
  transactionId: string;
  via: "client_post" | "revenuecat_webhook";
}): Promise<GrantResult> {
  const product = getHairMoneyProductFromNativeProductId(googleProductId);

  if (!product || !profileId || !transactionId) {
    return {
      applied: false,
      balance: null,
      httpStatus: 400,
      reason: "unknown_product_or_target",
    };
  }

  // 웹(이니시스)과 같은 RPC 래퍼 — gateway만 google_play라 원장 네임스페이스가 분리된다.
  // (source_type = "google_play_payment", source_id = Play 트랜잭션 id)
  const result = await creditHairMoneyForPayment({
    gateway: "google_play",
    paymentId: transactionId,
    product,
    profileId,
  });

  if (!result) {
    return {
      applied: false,
      balance: null,
      httpStatus: 400,
      reason: "not_a_hair_money_product",
    };
  }

  const alreadyApplied = result.reason === "already_applied";

  await recordPaymentEvent({
    actualAmount: product.amount,
    currency: "KRW",
    eventType: `iap_${via}`,
    expectedAmount: product.amount,
    failureReason: result.applied ? null : (result.reason ?? null),
    paymentId: transactionId,
    productId: product.id,
    profileId,
    provider: "google_play",
    rawPayload: { googleProductId, revenuecatEventId, via },
    status: result.applied ? "paid_verified" : `iap_${result.reason ?? "unknown"}`,
    verified: result.applied || alreadyApplied,
  });

  // 적립됐거나 이미 적립된 건은 성공. 그 외(RPC 실패 등)는 웹훅이 재시도하도록 5xx.
  if (!result.applied && !alreadyApplied) {
    return {
      applied: false,
      balance: null,
      httpStatus: result.reason === "supabase_not_configured" ? 503 : 502,
      reason: result.reason ?? "credit_failed",
    };
  }

  return {
    applied: result.applied,
    balance: result.balance,
    reason: result.reason,
  };
}

function matchesWebhookSecret(authHeader: string, expected: string) {
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}
