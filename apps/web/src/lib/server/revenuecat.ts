import { readServerEnv } from "@/lib/server/env";

// RevenueCat REST API로 "이 구매가 진짜인지" 확인한다.
//
// 왜 필요한가: 앱이 /api/payments/iap-grant로 직접 보내는 적립 요청(경로 A)은
// productId·transactionId를 클라이언트가 만들어 보낸다. 그대로 믿으면 로그인만 한
// 사용자가 아무 상품이나 공짜로 적립받을 수 있다(멱등 키는 같은 트랜잭션만 막는다).
//
// RevenueCat은 구글 영수증을 이미 검증한 뒤에만 구매를 기록하므로, "RevenueCat에
// 이 트랜잭션이 있는가"를 물어보는 것으로 검증이 된다.
//
// 웹훅(경로 B)과의 관계: 웹훅은 RevenueCat이 우리에게 밀어주는 것(push)이라 공유
// 시크릿으로 이미 인증된다. 이 파일은 반대 방향 — 우리가 물어보는 것(pull)이다.
// 둘 다 필요하다: 이쪽은 즉시 적립용, 웹훅은 이 요청이 유실됐을 때의 안전망.

const REVENUECAT_API_BASE = "https://api.revenuecat.com/v1";

export type RevenueCatVerification =
  // store: RevenueCat이 알려주는 실제 스토어("app_store" | "play_store" 등).
  // 애플/구글 매출을 구분해 기록하는 데 쓴다(예전엔 애플 결제도 google_play로 기록됐다).
  | { ok: true; store?: string }
  | { ok: false; reason: string; retryable: boolean };

type NonSubscriptionEntry = {
  id?: string;
  store?: string;
  store_transaction_id?: string;
};

type SubscriberResponse = {
  subscriber?: {
    non_subscriptions?: Record<string, NonSubscriptionEntry[]>;
  };
};

export function isRevenueCatVerificationConfigured() {
  return Boolean(readServerEnv("REVENUECAT_SECRET_API_KEY"));
}

export async function verifyPlayPurchase({
  googleProductId,
  profileId,
  transactionId,
}: {
  googleProductId: string;
  profileId: string;
  transactionId: string;
}): Promise<RevenueCatVerification> {
  const secretKey = readServerEnv("REVENUECAT_SECRET_API_KEY");

  // 키가 없으면 검증할 방법이 없다 → 적립하지 않는다(fail closed).
  // 이 상태에서도 결제가 유실되지는 않는다: RevenueCat 웹훅이 적립한다.
  if (!secretKey) {
    return { ok: false, reason: "verification_unavailable", retryable: false };
  }

  let response: Response;

  try {
    response = await fetch(
      `${REVENUECAT_API_BASE}/subscribers/${encodeURIComponent(profileId)}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch {
    // 네트워크 실패 — 진짜 구매일 수도 있으므로 웹훅이 재시도하도록 열어둔다.
    return { ok: false, reason: "revenuecat_unreachable", retryable: true };
  }

  if (response.status === 404) {
    return { ok: false, reason: "subscriber_not_found", retryable: false };
  }

  if (response.status === 401 || response.status === 403) {
    // 키가 잘못됐다 — 재시도해도 같다. 운영자가 고쳐야 한다.
    return { ok: false, reason: "revenuecat_unauthorized", retryable: false };
  }

  if (!response.ok) {
    return {
      ok: false,
      reason: `revenuecat_http_${response.status}`,
      retryable: response.status >= 500,
    };
  }

  let body: SubscriberResponse;

  try {
    body = (await response.json()) as SubscriberResponse;
  } catch {
    return { ok: false, reason: "revenuecat_bad_response", retryable: true };
  }

  // non_subscriptions는 상품 ID로 묶이며 애플/구글 구매가 함께 들어온다
  // (미리룩은 두 스토어가 동일한 상품 ID를 쓴다).
  const entries = body.subscriber?.non_subscriptions?.[googleProductId] ?? [];
  const matched = entries.find(
    (entry) =>
      entry?.store_transaction_id === transactionId || entry?.id === transactionId,
  );

  if (!matched) {
    return { ok: false, reason: "transaction_not_found", retryable: false };
  }

  return { ok: true, store: matched.store };
}
