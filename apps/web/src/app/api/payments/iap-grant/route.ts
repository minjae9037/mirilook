import { timingSafeEqual } from "node:crypto";
import { getHairMoneyProductFromNativeProductId } from "@/lib/mirilook-payments";
import { readServerEnv } from "@/lib/server/env";
import { creditHairMoneyForPayment } from "@/lib/server/hair-money";
import { recordPaymentEvent } from "@/lib/server/payment-events";
import { protectMutationRequest } from "@/lib/server/request-security";
import { verifyPlayPurchase } from "@/lib/server/revenuecat";
import { getVerifiedSupabaseUser } from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 30;

// 안드로이드 앱 인앱결제(Google Play) 적립 엔드포인트.
//
// 두 경로가 같은 엔드포인트로 들어온다:
//   A) 앱 클라이언트 직접 POST — 구매 직후 즉시 적립 (Supabase Bearer 토큰)
//   B) RevenueCat 웹훅 — A가 유실됐을 때의 안전망 (고정 Authorization 헤더)
//
// ⚠️ 경로 A는 로그인만 확인해선 안 된다. productId·transactionId를 클라이언트가
// 만들어 보내므로, 그대로 믿으면 로그인한 사용자가 아무 상품이나 공짜로 적립받는다
// (멱등 키는 "같은 트랜잭션"만 막지, 새 번호를 지어내는 건 못 막는다).
// 그래서 적립 전에 RevenueCat에 실구매인지 반드시 물어본다. 물어볼 수 없으면
// (시크릿 키 미설정 등) 적립하지 않는다 — 웹훅이 대신 적립하므로 결제는 유실되지 않는다.
// 경로 B는 RevenueCat이 공유 시크릿으로 자신을 인증하고, 구글 영수증 검증을 이미
// 마친 뒤에만 이벤트를 보내므로 추가 조회가 필요 없다.
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

    // 애플(APP_STORE)·구글(PLAY_STORE) 인앱결제만 적립한다.
    // ⚠️ 예전에는 PLAY_STORE만 통과시켜 **애플 결제 웹훅이 통째로 버려졌다**.
    // 그 탓에 iOS는 클라이언트 직접 POST가 실패하면(앱 종료·네트워크 끊김 등)
    // 결제는 됐는데 적립도 기록도 남지 않는 구멍이 있었다.
    if (event.store && !isSupportedIapStore(event.store)) {
      return Response.json({ accepted: true, skipped: `store:${event.store}` });
    }

    const grant = await grantIapCredit({
      googleProductId: event.product_id ?? "",
      profileId: event.app_user_id ?? "",
      revenuecatEventId: event.id ?? null,
      storeHint: event.store ?? null,
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

  // 실구매인지 RevenueCat에 확인한 뒤에만 적립한다.
  const verification = await verifyPlayPurchase({
    googleProductId,
    profileId: user.id,
    transactionId,
  });

  if (!verification.ok) {
    // 위조 시도든 검증 불가든 여기서는 적립하지 않는다.
    // 진짜 결제였다면 RevenueCat 웹훅이 곧 적립하므로 사용자가 돈을 잃지 않는다.
    // (클라이언트는 applied=false를 "적립 반영을 확인하는 중입니다"로 안내한다.)
    await recordPaymentEvent({
      actualAmount: null,
      currency: "KRW",
      eventType: "iap_client_post_rejected",
      expectedAmount: null,
      failureReason: verification.reason,
      paymentId: transactionId,
      // 클라이언트가 주장한 값 그대로 — 위조 시도 조사에 필요하다. 임의 문자열일 수 있어 자른다.
      productId: googleProductId.slice(0, 140),
      profileId: user.id,
      provider: "google_play",
      rawPayload: { googleProductId, via: "client_post" },
      status: `iap_${verification.reason}`,
      verified: false,
    });

    return Response.json(
      { applied: false, balance: null, reason: verification.reason },
      { status: verification.retryable ? 503 : 402 },
    );
  }

  const grant = await grantIapCredit({
    googleProductId,
    profileId: user.id,
    revenuecatEventId: null,
    // RevenueCat 검증 응답이 실제 스토어를 알려준다(애플/구글 매출 구분용).
    storeHint: verification.store ?? null,
    transactionId,
    via: "client_post",
  });

  return Response.json(grant, { status: grant.httpStatus ?? 200 });
}

async function grantIapCredit({
  googleProductId,
  profileId,
  revenuecatEventId,
  storeHint,
  transactionId,
  via,
}: {
  googleProductId: string;
  profileId: string;
  revenuecatEventId: string | null;
  storeHint: string | null;
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
    // 실제 스토어로 기록한다(애플 결제가 google_play로 잡히던 문제).
    // 원장 gateway는 멱등성 네임스페이스라 기존 값을 유지한다.
    provider: storeToProvider(storeHint),
    rawPayload: { googleProductId, revenuecatEventId, store: storeHint, via },
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

// RevenueCat이 알려주는 스토어 값 → payment_events.provider
// (애플: APP_STORE / 구글: PLAY_STORE. 값이 없으면 예전 동작대로 google_play)
function storeToProvider(store: string | null) {
  const key = (store ?? "").toUpperCase();

  if (key === "APP_STORE") {
    return "app_store";
  }

  if (key === "PLAY_STORE") {
    return "google_play";
  }

  return store ? store.toLowerCase() : "google_play";
}

// 적립 대상 인앱결제 스토어(애플·구글). 프로모션/샌드박스 외 스토어는 제외.
function isSupportedIapStore(store: string) {
  const key = store.toUpperCase();

  return key === "APP_STORE" || key === "PLAY_STORE";
}

function matchesWebhookSecret(authHeader: string, expected: string) {
  const a = Buffer.from(authHeader);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}
