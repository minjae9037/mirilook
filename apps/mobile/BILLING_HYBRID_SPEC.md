# 미리룩 합법 하이브리드 결제 설계서 (BILLING_HYBRID_SPEC)

> **결정(2026-07-08 확정, 재논의 금지):** 넷플릭스 모델.
> 안드로이드 앱 = Google Play Billing(15%), 웹 mirilook.com = 자체 PG(KG이니시스),
> **둘 다 같은 Supabase Hair Money 잔액에 적립.** 어디서 충전하든 앱·웹 어디서나 사용.
>
> **철칙(안티-스티어링):** 앱 안에서는 "웹에서 구매/더 싸게" 류의 안내·링크·가격비교를 절대 노출하지 않는다.
>
> **상태:** 네이티브 스캐폴딩 완료(`@revenuecat/purchases-capacitor@13.2.1` 설치 + `cap sync android/ios` 통과).
> 웹 측 코드(§6)는 **재패키징 시점에 붙일 드롭인 코드 블록**으로만 제공 — 지금 라이브 웹(apps/web)에는 미적용.

---

## 1. 아키텍처 — 두 결제 경로, 하나의 잔액

```
[웹 브라우저]                                  [안드로이드 앱 (Capacitor 셸이 mirilook.com 로드)]
     │                                                     │
     │ ① POST /api/payments/inicis/prepare                 │ ① Purchases.purchaseStoreProduct()
     │    → payment_orders 주문 생성(oid)                   │    (Google Play 결제 시트)
     │ ② INIStdPay 결제창(카드)                             │ ② RevenueCat이 영수증 검증
     │ ③ 이니시스 → POST /api/payments/inicis/return        │ ③-a 앱 → POST /api/payments/iap-grant (즉시 적립)
     │    승인(requestInicisApproval) + 검증                 │ ③-b RevenueCat 웹훅 → POST /api/payments/iap-grant
     │ ④ creditHairMoneyForPayment(gateway:"inicis")        │      (안전망 — ③-a 유실 시 보정)
     │                                                     │ ④ credit_hair_money RPC(gateway:"google_play")
     ▼                                                     ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │              Supabase (공용 잔액 — 단일 진실 원천)                  │
   │  public.hair_money_accounts  (profile_id PK, balance,            │
   │                               total_purchased, total_spent)      │
   │  public.hair_money_ledger    (unique(profile_id, source_type,    │
   │                               source_id) ← 멱등의 핵심)            │
   │  RPC: credit_hair_money / spend_hair_money / refund_hair_money   │
   └──────────────────────────────────────────────────────────────────┘
```

### 1.1 기존 웹 플로우의 실제 좌표 (Task 1 조사 결과 — 이 스펙의 준거)

| 항목 | 실제 값 | 파일 |
|---|---|---|
| 잔액 테이블 | `public.hair_money_accounts.balance` (+ `total_purchased`, `total_spent`) | `supabase/migrations/202606260004_hair_money_store.sql` |
| 원장 테이블 | `public.hair_money_ledger` — **`unique (profile_id, source_type, source_id)`** | 같은 파일 (68행) |
| 적립 RPC | `public.credit_hair_money(...)` — 원장 insert `on conflict do nothing` → 중복이면 `applied=false, reason='already_applied'` | 같은 파일 (89행~) |
| 서버 래퍼 | `creditHairMoneyForPayment({ paymentId, product, profileId, gateway })` — `source_type = "${gateway}_payment"`, `source_id = paymentId` | `apps/web/src/lib/server/hair-money.ts` (126행) |
| 상품 정의 | `MirilookHairMoneyProducts` (6종, 1HM=550원 VAT포함) | `apps/web/src/lib/mirilook-payments.ts` |
| 주문 테이블 | `public.payment_orders` (payment_id PK, status) | 위 마이그레이션 + `apps/web/src/lib/server/payment-orders.ts` |
| 이벤트 로그 | `payment_events` — `recordPaymentEvent()`가 `onConflict: "payment_id"` upsert | `apps/web/src/lib/server/payment-events.ts` |
| 웹 구매 UI | `MirilookHairMoneyStore` (스토어 `/store`) | `apps/web/src/components/mirilook-hair-money-store.tsx` |
| 엔타이틀먼트 구매 UI | `MirilookPaymentPanel` (`/votes` 페이지, `mirilook-studio.tsx` 6081행) | `apps/web/src/components/mirilook-payment-panel.tsx` |
| 웹 결제 승인 | `POST /api/payments/inicis/return` → 승인·금액검증 → `creditHairMoneyForPayment(gateway:"inicis")` | `apps/web/src/app/api/payments/inicis/return/route.ts` |
| 적립 유실 보정 | `POST /api/payments/inicis/reconcile` — RPC 멱등성 덕에 재호출 안전 | `apps/web/src/app/api/payments/inicis/reconcile/route.ts` |
| 인증 방식 | 클라이언트 `getSupabaseAccessToken()` → 서버 `getVerifiedSupabaseUser(request)` (Bearer) | `apps/web/src/lib/supabase-browser.ts` / `lib/server/supabase-admin.ts` |

**핵심 통찰:** 멱등성은 이미 DB 레벨(`hair_money_ledger` unique 제약 + RPC의 `on conflict do nothing`)에 있다.
IAP 적립도 **같은 RPC를 다른 `source_type`/`source_id`로 호출**하기만 하면 이중적립이 구조적으로 불가능하다.
웹의 "return(즉시) + reconcile(보정)" 이중화 패턴을 IAP에서는 "앱 직접 POST(즉시) + RevenueCat 웹훅(보정)"으로 그대로 미러링한다.

> 참고: `/api/payments/complete`·`/api/payments/webhook`·`/api/payments/checkout`은 PortOne 경로(현재 비활성/병행 대비). 현재 활성 PG는 이니시스이며(`hair-money.ts` 135행 주석), IAP는 이 둘과 독립된 세 번째 gateway로 추가한다.

---

## 2. Capacitor 감지 게이트 — "지금 앱 안인가?"

### 2.1 원리

앱은 `capacitor.config.ts`의 `server.url = https://mirilook.com`(hybrid-remote)로 라이브 사이트를 로드한다.
이때 Capacitor 네이티브 브리지가 **원격 페이지에 `window.Capacitor` 런타임을 주입**한다.
즉, 웹 번들이 `@capacitor/core`를 import하지 않아도(실제로 apps/web 의존성에 없음) 앱 WebView 안에서는 전역 `window.Capacitor`가 존재하고, 등록된 네이티브 플러그인은 `window.Capacitor.Plugins.<이름>`으로 호출 가능하다.

**따라서 웹 쪽 게이트는 반드시 `import { Capacitor } from "@capacitor/core"`가 아니라 `window.Capacitor` 전역을 사용해야 한다** (import 방식은 apps/web 빌드가 깨짐 — 패키지 미설치).

### 2.2 게이트 헬퍼 (재패키징 시 `apps/web/src/lib/mirilook-native.ts`로 추가)

```ts
// apps/web/src/lib/mirilook-native.ts  (신규 파일 — 재패키징 시 추가)
"use client";

import { useEffect, useState } from "react";

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  getPlatform?: () => string;
  Plugins?: Record<string, unknown>;
};

declare global {
  interface Window {
    Capacitor?: CapacitorGlobal;
  }
}

/** 미리룩 네이티브 앱(Capacitor 셸) 안에서 실행 중인지. SSR에선 항상 false. */
export function isMirilookApp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.Capacitor?.isNativePlatform?.() === true;
  } catch {
    return false;
  }
}

/** "android" | "ios" | null */
export function getMirilookAppPlatform(): "android" | "ios" | null {
  if (!isMirilookApp()) {
    return null;
  }

  const platform = window.Capacitor?.getPlatform?.();

  return platform === "android" || platform === "ios" ? platform : null;
}

/**
 * React 훅 — hydration mismatch 방지를 위해 초기값 false로 렌더한 뒤
 * 마운트 후 실제 값으로 갱신한다. (SSR HTML은 항상 웹 모드로 나온다.)
 */
export function useIsMirilookApp() {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    setIsApp(isMirilookApp());
  }, []);

  return isApp;
}
```

**주의(hydration):** 서버 렌더 HTML은 항상 "웹 모드"다. 게이트는 `useIsMirilookApp()` 훅처럼 마운트 후 상태로 분기해야 React hydration 오류가 없다. 첫 페인트 한 프레임 동안 웹 UI가 스칠 수 있으므로, 결제 버튼처럼 민감한 요소는 `isApp` 확정 전까지 로딩 상태로 두는 것을 권장한다.

---

## 3. 안티-스티어링 UI 규칙 (네이티브 모드에서 숨김/치환 목록)

구글 정책상 제약은 **"구매 흐름"**에 걸린다. 웹에서 충전한 HM을 앱에서 쓰는 것, 잔액·사용내역 표시는 전부 허용. 아래는 `useIsMirilookApp() === true`일 때의 규칙.

### 3.1 반드시 숨기거나 치환할 것

대상 컴포넌트 ①: **`apps/web/src/components/mirilook-hair-money-store.tsx`** (`/store` 페이지, 유일한 HM 충전 UI)

| # | 요소 (현재 코드 위치) | 네이티브 모드 처리 |
|---|---|---|
| 1 | `startPayment()` — 이니시스 prepare 호출 + `INIStdPay` 결제창 (236~286행) | **`purchaseHairMoneyNative()`로 치환** (§6-B). 이니시스 스크립트 로드·폼 제출 경로 자체를 타지 않게 분기 |
| 2 | "KG이니시스 PG" 뱃지 (359~362행) | 숨김. 대체 표기 필요 시 "Google Play 결제" |
| 3 | "카드 결제가 확인되면 …" 헤더 카피 (304행) | "결제가 확인되면 …"으로 치환 (결제수단 언급 제거) |
| 4 | "충전 전 필수 확인" PG 고지 블록 — "최초 결제하신 결제수단(카드 등)으로만 환불", "7일 이내 청약철회" (510~531행) | Google Play 고지로 치환: "구매·환불은 Google Play 결제 정책을 따릅니다. 환불은 Google Play 주문내역에서 신청할 수 있습니다." |
| 5 | `RefundPolicy` 컴포넌트 — PG 환불 조항 (664~690행) | 네이티브 전용 문안으로 치환(위와 동일 취지). `/refund` 링크는 유지 가능하되 문서에 웹 결제 유도 문구가 없어야 함 |
| 6 | 결제 실패/오류 문구 중 "결제창", "팝업 차단" (`getCheckoutErrorMessage`, `getPaymentClientErrorMessage`) | 네이티브용 오류 문구로 분기 ("Google Play 결제가 취소되었습니다" 등) |
| 7 | 원장 라벨 `"카드 결제 충전"` (`getLedgerReasonLabel`, 774행) | 중립 표현 "Hair Money 충전"으로. (웹 구매분 내역이 앱에 보이는 것 자체는 합법 — 라벨만 결제수단 중립화) |

대상 컴포넌트 ②: **`apps/web/src/components/mirilook-payment-panel.tsx`** (엔타이틀먼트 상품 — `/votes` 페이지 119행, `mirilook-studio.tsx` 6081행)

- 이 패널도 이니시스 prepare(182행)를 호출하는 **구매 흐름**이므로 네이티브에서 그대로 노출 금지.
- **v1 결정: 네이티브 모드에서는 패널 전체 숨김**(투표 노출·살롱팩 등 엔타이틀먼트는 앱 v1 미판매). 후속으로 판매하려면 §4에 SKU를 추가하고 HM과 동일 플로우를 태운다.
- 숨길 때 "웹에서 구매하세요" 같은 대체 문구를 넣으면 그 자체가 스티어링 위반 — **아무 안내 없이 섹션 제거**가 정답.

### 3.2 절대 추가하면 안 되는 것 (레드라인)

- "웹/mirilook.com에서 구매", "웹이 더 저렴" 등 외부 결제 유도 문구·링크·배너·푸시.
- 웹 가격과 앱 가격의 **비교 노출** (각자 자기 가격만 표시).
- 외부 브라우저로 결제 페이지를 여는 딥링크/공유 버튼.
- 이메일·알림(`queueNotificationEvent`)이라도 **앱 안에서 렌더되는 알림**에 웹 결제 유도를 넣지 않는다.

### 3.3 그대로 두어도 되는 것

- 잔액·원장 표시, 커뮤니티 +1 HM 무료 미션(구매가 아님), HM "사용"(추천 차감) 흐름 전부.
- 웹에서 충전한 잔액이 앱에 보이고 사용되는 것 — 이게 이 모델의 합법 포인트.

---

## 4. 상품(SKU) 매핑 — Play Console·RevenueCat에 만들 소모성 상품

웹 상품(`MirilookHairMoneyProducts`, `apps/web/src/lib/mirilook-payments.ts` 85~146행)과 1:1 대응.
가격은 웹과 동일하게 시작(비교 노출만 안 하면 다르게 매겨도 합법이지만, v1은 동일가로 단순하게).

| Google product_id (소모성/관리형 상품) | 크레딧 수(HM) | 가격(원, VAT포함) | 웹 대응 패키지 id | 웹 상품명 |
|---|---|---|---|---|
| `hair_money_4`   | 4   | 2,200  | `hair-money-2000`  | Hair Money 4 |
| `hair_money_20`  | 20  | 11,000 | `hair-money-10000` | Hair Money 20 |
| `hair_money_40`  | 40  | 22,000 | `hair-money-20000` | Hair Money 40 |
| `hair_money_60`  | 60  | 33,000 | `hair-money-30000` | Hair Money 60 |
| `hair_money_80`  | 80  | 44,000 | `hair-money-40000` | Hair Money 80 |
| `hair_money_100` | 100 | 55,000 | `hair-money-50000` | Hair Money 100 |

- product_id 규칙: 소문자·숫자·밑줄·마침표, 생성 후 변경 불가 — 위 표기 그대로 생성.
- 서버 매핑 테이블(§6-C의 `IAP_PRODUCTS`)이 이 표의 단일 원천. RevenueCat product_id → HM 수·웹 상품 id로 변환.
- 참고 마진: 55,000원 판매 시 구글 15% 공제 → 46,750원 정산(웹 PG 대비 낮음. 그래도 앱 내 가격 인상은 후속 판단 — 인상해도 앱 안에서 웹과 비교만 안 하면 됨).

---

## 5. 구매 → 적립 플로우 (멱등성 포함)

```
① 앱(웹뷰 안 /store) : Purchases.logIn({ appUserID: <Supabase profile id> })
② 앱 : Purchases.purchaseStoreProduct(product)  → Google Play 결제 시트
③ RevenueCat : 영수증 검증, transaction 반환 { transactionIdentifier, productIdentifier }
④-a (즉시 경로) 앱 → POST /api/payments/iap-grant
      body: { transactionId, productId }  + Authorization: Bearer <Supabase access token>
④-b (안전망)   RevenueCat 웹훅(NON_RENEWING_PURCHASE) → POST /api/payments/iap-grant
      Authorization: Bearer <IAP_GRANT_WEBHOOK_SECRET> (RevenueCat 대시보드에 설정한 고정 헤더)
⑤ 서버 : credit_hair_money RPC 호출
      p_source_type = 'google_play_iap'
      p_source_id   = <store transaction id>        ← 멱등 키
   → hair_money_ledger unique(profile_id, source_type, source_id) 제약으로
     ④-a와 ④-b가 둘 다 도착해도 두 번째는 applied=false('already_applied') — 이중적립 불가
⑥ 서버 : recordPaymentEvent(paymentId=transactionId, provider 구분값 포함) — 감사 로그
⑦ 앱 : 응답의 balance로 지갑 UI 갱신 (실패 시 기존 refreshWallet() 재사용)
```

**멱등성 규정(필수):**
- 1차 dedup 키 = **Google Play 트랜잭션 id** (`transaction.transactionIdentifier`, 웹훅에서는 `event.transaction_id`). 이것이 `hair_money_ledger.source_id`.
- `source_type`은 `'google_play_iap'`로 고정 — 이니시스(`inicis_payment`)·PortOne(`portone_payment`)과 네임스페이스 분리.
- RevenueCat 웹훅 재전송(같은 `event.id` 또는 같은 `transaction_id`)도 자동 무해화 — 웹 reconcile과 동일 원리.
- 사용자 검증: ④-a는 Bearer 토큰의 `user.id`가 적립 대상. ④-b는 `event.app_user_id`(= `logIn`에 넣은 profile id)가 대상. 두 경로 모두 같은 profile id로 수렴해야 하며, ④-a에서 RevenueCat REST(`GET /v1/subscribers/{app_user_id}`)로 트랜잭션 존재를 교차검증하는 강화 옵션을 §6-C에 주석으로 남김.

서버 엔드포인트 스켈레톤은 §6-C 참조 (신규 파일 `apps/web/src/app/api/payments/iap-grant/route.ts` — **지금 만들지 않음**).

---

## 6. 드롭인 코드 (⚠️ 재패키징 시점에 붙일 것 — 지금 라이브 웹에 넣지 말 것)

### 6-A. 네이티브 결제 클라이언트 헬퍼 — `apps/web/src/lib/native-billing.ts` (신규)

원격 로드 구조라 npm 패키지 import 불가 → **주입된 브리지 `window.Capacitor.Plugins.Purchases`를 직접 호출**한다.
(플러그인 등록명 "Purchases" — `@revenuecat/purchases-capacitor@13.2.1` `dist/esm/index.js`의 `registerPlugin('Purchases', ...)`에서 확인.)

```ts
// apps/web/src/lib/native-billing.ts  (신규 파일 — 재패키징 시 추가)
"use client";

import { isMirilookApp } from "@/lib/mirilook-native";

// §4 SKU 표와 반드시 일치시킬 것.
export const NATIVE_HAIR_MONEY_PRODUCT_IDS = [
  "hair_money_4",
  "hair_money_20",
  "hair_money_40",
  "hair_money_60",
  "hair_money_80",
  "hair_money_100",
] as const;

// 웹 패키지 id → 구글 product id (양방향 매핑의 클라이언트 절반)
export const WEB_TO_NATIVE_PRODUCT: Record<string, string> = {
  "hair-money-2000": "hair_money_4",
  "hair-money-10000": "hair_money_20",
  "hair-money-20000": "hair_money_40",
  "hair-money-30000": "hair_money_60",
  "hair-money-40000": "hair_money_80",
  "hair-money-50000": "hair_money_100",
};

// RevenueCat "Public API key" (Android용, goog_... — 비밀 아님, 노출 가능)
const REVENUECAT_PUBLIC_API_KEY_ANDROID = "goog_XXXXXXXXXXXXXXXX"; // TODO: 발급 후 교체

type PurchasesBridge = {
  configure(options: { apiKey: string; appUserID?: string | null }): Promise<void>;
  logIn(options: { appUserID: string }): Promise<unknown>;
  getProducts(options: {
    productIdentifiers: string[];
    type?: string;
  }): Promise<{ products: NativeStoreProduct[] }>;
  purchaseStoreProduct(options: {
    product: NativeStoreProduct;
  }): Promise<{
    productIdentifier: string;
    transaction?: { transactionIdentifier?: string };
  }>;
  restorePurchases(): Promise<unknown>;
};

export type NativeStoreProduct = {
  identifier: string;
  priceString: string;
  price: number;
  currencyCode: string;
  title?: string;
  [key: string]: unknown;
};

function getPurchasesBridge(): PurchasesBridge | null {
  if (!isMirilookApp()) {
    return null;
  }

  const bridge = window.Capacitor?.Plugins?.Purchases as
    | PurchasesBridge
    | undefined;

  return bridge ?? null;
}

let configuredForProfile: string | null = null;

/** 로그인된 Supabase profile id로 RevenueCat 초기화(중복 호출 안전). */
export async function ensureNativeBillingReady(profileId: string) {
  const purchases = getPurchasesBridge();

  if (!purchases) {
    throw new Error("native_billing_unavailable");
  }

  if (configuredForProfile === null) {
    await purchases.configure({
      apiKey: REVENUECAT_PUBLIC_API_KEY_ANDROID,
      appUserID: profileId,
    });
    configuredForProfile = profileId;
    return;
  }

  if (configuredForProfile !== profileId) {
    await purchases.logIn({ appUserID: profileId });
    configuredForProfile = profileId;
  }
}

/** 스토어 상품(현지화 가격 포함) 조회 — UI에 priceString을 그대로 표시. */
export async function getNativeHairMoneyProducts() {
  const purchases = getPurchasesBridge();

  if (!purchases) {
    throw new Error("native_billing_unavailable");
  }

  const { products } = await purchases.getProducts({
    productIdentifiers: [...NATIVE_HAIR_MONEY_PRODUCT_IDS],
    type: "NON_SUBSCRIPTION",
  });

  return products;
}

/**
 * 구매 실행 → 서버 적립(iap-grant) → 잔액 반환.
 * @returns { balance } 적립 후 잔액. 사용자가 취소하면 "purchase_cancelled" throw.
 */
export async function purchaseNativeHairMoney({
  accessToken,
  product,
}: {
  accessToken: string;
  product: NativeStoreProduct;
}) {
  const purchases = getPurchasesBridge();

  if (!purchases) {
    throw new Error("native_billing_unavailable");
  }

  let result: Awaited<ReturnType<PurchasesBridge["purchaseStoreProduct"]>>;

  try {
    result = await purchases.purchaseStoreProduct({ product });
  } catch (error) {
    // RevenueCat은 사용자 취소를 userCancelled 플래그가 담긴 에러로 reject한다.
    const record = (error ?? {}) as Record<string, unknown>;
    if (record.userCancelled === true || record.code === "1") {
      throw new Error("purchase_cancelled");
    }
    throw error;
  }

  const transactionId = result.transaction?.transactionIdentifier;

  if (!transactionId) {
    throw new Error("missing_transaction_id");
  }

  // 즉시 적립 경로(④-a). 실패해도 RevenueCat 웹훅(④-b)이 보정한다.
  const response = await fetch("/api/payments/iap-grant/", {
    body: JSON.stringify({
      productId: result.productIdentifier,
      transactionId,
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const grant = (await response.json().catch(() => null)) as {
    applied?: boolean;
    balance?: number;
    reason?: string;
  } | null;

  return {
    applied: grant?.applied ?? false,
    balance: grant?.balance ?? null,
    reason: grant?.reason,
    transactionId,
  };
}

/** "구매 복원" — 소모성이라 통상 불필요하지만 고객문의 대응용으로 노출 권장. */
export async function restoreNativePurchases() {
  const purchases = getPurchasesBridge();

  if (!purchases) {
    throw new Error("native_billing_unavailable");
  }

  return purchases.restorePurchases();
}
```

### 6-B. 웹 구매 컴포넌트에 넣을 게이트 — `mirilook-hair-money-store.tsx` 수정분

핵심 diff만 발췌(재패키징 시 적용). `startPayment()` 초입에서 분기하고, §3.1 표의 문구·뱃지·고지를 `isApp`으로 감싼다.

```tsx
// mirilook-hair-money-store.tsx 상단 import에 추가
import { useIsMirilookApp } from "@/lib/mirilook-native";
import {
  ensureNativeBillingReady,
  getNativeHairMoneyProducts,
  purchaseNativeHairMoney,
  WEB_TO_NATIVE_PRODUCT,
} from "@/lib/native-billing";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"; // 세션에서 user.id를 직접 읽는다 (전용 유틸 없음)

export function MirilookHairMoneyStore() {
  const isApp = useIsMirilookApp(); // ← 추가
  // ... 기존 state 유지 ...

  async function startPayment() {
    if (!selectedProduct) {
      return;
    }

    // ── 네이티브 앱: Google Play Billing 경로 ─────────────────────────
    if (isApp) {
      setIsPaying(true);
      setStatus("Google Play 결제를 준비하는 중입니다.");

      try {
        const token = await getSupabaseAccessToken();
        const session = await getSupabaseBrowserClient()?.auth.getSession();
        const profileId = session?.data.session?.user.id ?? null;

        if (!token || !profileId) {
          setNeedsLogin(true);
          setStatus("Hair Money 충전은 로그인된 계정에 적립됩니다.");
          return;
        }

        await ensureNativeBillingReady(profileId);

        const nativeProductId = WEB_TO_NATIVE_PRODUCT[selectedProduct.id];
        const products = await getNativeHairMoneyProducts();
        const product = products.find((p) => p.identifier === nativeProductId);

        if (!product) {
          setStatus("상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
          return;
        }

        const grant = await purchaseNativeHairMoney({ accessToken: token, product });

        setStatus(
          grant.applied
            ? "결제가 완료되었습니다. Hair Money가 적립되었습니다."
            : "결제가 완료되었습니다. 적립 반영을 확인하는 중입니다.",
        );
        await refreshWallet();
      } catch (error) {
        if (error instanceof Error && error.message === "purchase_cancelled") {
          setStatus("결제를 취소했습니다. 다시 시도할 수 있습니다.");
        } else {
          console.error(error);
          setStatus("Google Play 결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        setIsPaying(false);
      }

      return; // 이니시스 경로 진입 금지
    }
    // ── 이하 기존 웹(이니시스) 경로 그대로 ───────────────────────────
    // ...
  }

  // JSX 게이트 예시 (§3.1 표의 각 항목에 동일 패턴 적용):
  // {!isApp ? (
  //   <span className="...">KG이니시스 PG</span>
  // ) : null}
  //
  // {isApp ? <GooglePlayNotice /> : <기존 PG 고지 블록 />}
}
```

`mirilook-payment-panel.tsx`(엔타이틀먼트)는 v1에서 통째로 게이트:

```tsx
// mirilook-payment-panel.tsx — 컴포넌트 최상단에 추가
const isApp = useIsMirilookApp();

if (isApp) {
  return null; // v1: 네이티브에서는 엔타이틀먼트 미판매. 대체 안내 문구도 넣지 않는다(스티어링 금지).
}
```

### 6-C. 서버 적립 엔드포인트 — `apps/web/src/app/api/payments/iap-grant/route.ts` (신규)

앱 직접 POST(④-a)와 RevenueCat 웹훅(④-b)을 **한 엔드포인트**로 받는다. 멱등이라 순서·중복 무관.

```ts
// apps/web/src/app/api/payments/iap-grant/route.ts  (신규 파일 — 재패키징 시 추가)
import { getPaymentProduct } from "@/lib/mirilook-payments";
import { readServerEnv } from "@/lib/server/env";
import { recordPaymentEvent } from "@/lib/server/payment-events";
import { protectMutationRequest } from "@/lib/server/request-security";
import {
  getSupabaseAdminClient,
  getVerifiedSupabaseUser,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 30;

// §4 SKU 표의 서버측 단일 원천 — 구글 product id → 웹 상품 id.
const IAP_PRODUCTS: Record<string, { webProductId: string }> = {
  hair_money_4: { webProductId: "hair-money-2000" },
  hair_money_20: { webProductId: "hair-money-10000" },
  hair_money_40: { webProductId: "hair-money-20000" },
  hair_money_60: { webProductId: "hair-money-30000" },
  hair_money_80: { webProductId: "hair-money-40000" },
  hair_money_100: { webProductId: "hair-money-50000" },
};

const IAP_SOURCE_TYPE = "google_play_iap"; // hair_money_ledger.source_type — 멱등 네임스페이스

type ClientGrantPayload = {
  productId?: string; // 구글 product id
  transactionId?: string; // Google Play 트랜잭션 id (예: GPA.1234-....)
};

type RevenueCatWebhookPayload = {
  api_version?: string;
  event?: {
    app_user_id?: string; // = Supabase profile id (Purchases.logIn 값)
    id?: string; // RevenueCat 이벤트 id
    product_id?: string;
    store?: string; // "PLAY_STORE"
    transaction_id?: string;
    type?: string; // "NON_RENEWING_PURCHASE" 등
  };
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
  const webhookSecret = readServerEnv("REVENUECAT_WEBHOOK_AUTH"); // 예: "Bearer <랜덤 시크릿>"

  // ── 경로 B: RevenueCat 웹훅 (Authorization 헤더가 대시보드에 설정한 시크릿과 일치) ──
  if (webhookSecret && authHeader === webhookSecret) {
    let payload: RevenueCatWebhookPayload;

    try {
      payload = JSON.parse(rawBody) as RevenueCatWebhookPayload;
    } catch {
      return Response.json({ error: "invalid_payload" }, { status: 400 });
    }

    const event = payload.event;

    // 소모성 구매 이외 이벤트(TEST, TRANSFER 등)는 조용히 수락.
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

    // 웹훅은 5xx면 RevenueCat이 재시도한다 — 일시 오류만 5xx로.
    return Response.json(grant, { status: grant.applied || grant.reason === "already_applied" ? 200 : grant.httpStatus ?? 200 });
  }

  // ── 경로 A: 앱 클라이언트 직접 POST (Supabase Bearer 토큰) ──
  const user = await getVerifiedSupabaseUser(request);

  if (!user) {
    return Response.json({ applied: false, reason: "not_authenticated" }, { status: 401 });
  }

  let payload: ClientGrantPayload;

  try {
    payload = JSON.parse(rawBody) as ClientGrantPayload;
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const transactionId = typeof payload.transactionId === "string" ? payload.transactionId.trim().slice(0, 140) : "";
  const googleProductId = typeof payload.productId === "string" ? payload.productId.trim() : "";

  if (!transactionId || !googleProductId) {
    return Response.json({ error: "transactionId and productId required" }, { status: 400 });
  }

  // 강화 옵션(권장): RevenueCat REST로 이 app_user_id에 해당 transaction이 실제 존재하는지 교차검증.
  //   GET https://api.revenuecat.com/v1/subscribers/{user.id}
  //   Authorization: Bearer <REVENUECAT_SECRET_API_KEY>
  //   → non_subscriptions[googleProductId][].id 에 transactionId 존재 확인 후 적립.
  // v1은 웹훅(경로 B)이 진실 원천이므로 생략 가능하나, 클라이언트 위조 방지를 원하면 활성화.

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
}): Promise<{ applied: boolean; balance: number | null; reason?: string; httpStatus?: number }> {
  const mapping = IAP_PRODUCTS[googleProductId];
  const product = mapping ? getPaymentProduct(mapping.webProductId) : undefined;

  if (!mapping || !product?.hairMoneyAmount || !profileId || !transactionId) {
    return { applied: false, balance: null, reason: "unknown_product_or_target", httpStatus: 400 };
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return { applied: false, balance: null, reason: "supabase_not_configured", httpStatus: 503 };
  }

  // 멱등 적립 — 웹의 creditHairMoneyForPayment와 같은 RPC, source만 IAP 네임스페이스.
  // (hair_money_ledger unique(profile_id, source_type, source_id) → 중복이면 already_applied)
  const result = await supabase.rpc("credit_hair_money", {
    p_amount: product.hairMoneyAmount,
    p_metadata: {
      gateway: "google_play",
      googleProductId,
      productId: product.id,
      productName: product.name,
      revenuecatEventId,
      via,
    },
    p_profile_id: profileId,
    p_reason: "hair_money_purchase",
    p_source_id: transactionId,
    p_source_type: IAP_SOURCE_TYPE,
  });

  if (result.error) {
    console.error("iap credit_hair_money failed", result.error);
    return { applied: false, balance: null, reason: "supabase_rpc_failed", httpStatus: 502 };
  }

  const row = (Array.isArray(result.data) ? result.data[0] : result.data) as
    | { applied: boolean; balance: number; reason: string | null }
    | undefined;

  // 감사 로그 — payment_events는 payment_id upsert라 재수신에도 안전.
  await recordPaymentEvent({
    actualAmount: product.amount,
    currency: "KRW",
    eventType: `iap_${via}`,
    expectedAmount: product.amount,
    failureReason: row?.applied ? null : row?.reason ?? null,
    paymentId: transactionId,
    profileId,
    productId: product.id,
    rawPayload: { googleProductId, revenuecatEventId, via },
    status: row?.applied ? "paid_verified" : `iap_${row?.reason ?? "unknown"}`,
    verified: Boolean(row?.applied) || row?.reason === "already_applied",
  });

  return {
    applied: Boolean(row?.applied),
    balance: row?.balance ?? null,
    reason: row?.reason ?? undefined,
  };
}
```

**재패키징 시 함께 확인할 것:**
- `recordPaymentEvent`가 `provider: "portone"`을 하드코딩(`payment-events.ts` 48행) — provider 파라미터화(`"google_play"`) 리팩터 권장(선택).
- 또는 `creditHairMoneyForPayment`의 `gateway` 유니언(`"inicis" | "portone"`)에 `"google_play"`를 추가해 래퍼를 재사용해도 됨 — 위 스켈레톤은 apps/web 기존 파일을 안 건드리려고 RPC 직접 호출로 작성.
- Vercel env 추가: `REVENUECAT_WEBHOOK_AUTH`(웹훅 인증 문자열), (강화 옵션 시) `REVENUECAT_SECRET_API_KEY`.

---

## 7. Play Console + RevenueCat 설정 절차 (단계별)

### 7.1 Google Play Console — 소모성 상품 생성

1. https://play.google.com/console 로그인 → 앱 `com.mirilook.app` 선택 (앱이 아직 없으면 먼저 "앱 만들기"로 생성 — PLAY_STORE_PREP.md §1 참고).
2. 좌측 메뉴 **수익 창출 > 상품 > 인앱 상품** 클릭.
3. **상품 만들기** 버튼 → 아래를 §4 표대로 6번 반복:
   - 상품 ID: `hair_money_4` (생성 후 변경 불가 — 오타 주의)
   - 이름: `Hair Money 4` / 설명: `헤어스타일 추천에 사용하는 Hair Money 4개`
   - 가격: **직접 설정** → 대한민국 KRW 2,200원 입력 (구글이 세금 포함가 처리 방식을 물으면 "가격에 세금 포함" 선택)
   - **저장 → 활성화**.
4. ⚠️ 인앱 상품 메뉴가 잠겨 있으면: **수익 창출 설정(Monetization setup)에서 판매자 계정(지급 프로필) 연결**을 먼저 완료해야 한다. 설정 > 지급 프로필에서 엠제이인사이트 사업자 정보로 등록.
5. 참고: Google Play Billing Library에서 소모성 여부는 "소비(consume) 처리"로 결정된다. RevenueCat이 구매 후 자동으로 consume하므로 Play Console 쪽에 별도 "소모성" 체크박스는 없다 — 위처럼 일반 인앱 상품으로 만들면 된다.

### 7.2 Google Cloud 서비스 계정 (RevenueCat ↔ 구글 API 연결용)

1. https://console.cloud.google.com → 프로젝트 선택(없으면 신규 "mirilook-play").
2. **API 및 서비스 > 라이브러리** → "Google Play Android Developer API" 검색 → **사용 설정**.
3. **IAM 및 관리자 > 서비스 계정 > 서비스 계정 만들기**:
   - 이름 `revenuecat-play` → 만들기 → 역할은 부여하지 않고 완료.
   - 만든 계정 클릭 → **키 탭 > 키 추가 > 새 키 만들기 > JSON** → JSON 파일 다운로드(안전 보관 — 이게 RevenueCat에 올릴 크리덴셜).
4. Play Console → **사용자 및 권한 > 사용자 초대** → 서비스 계정 이메일(`revenuecat-play@....iam.gserviceaccount.com`) 입력:
   - 권한: "재무 데이터 보기", "주문 및 구독 관리"(앱 권한에서 `com.mirilook.app` 지정) → 초대 저장.
5. 권한 전파에 최대 24~36시간 걸릴 수 있음(에러 나면 다음날 재시도).

### 7.3 RevenueCat 프로젝트

1. https://app.revenuecat.com 가입(무료 — 월 추적수익 $2,500까지 무과금) → **New Project** `mirilook`.
2. **Project Settings > Apps > + New > Play Store**:
   - App name `Mirilook Android`, Package `com.mirilook.app`
   - **Service Account credentials JSON** 업로드(7.2에서 받은 파일) → 저장.
   - 저장 후 표시되는 **Public API key(`goog_...`)** 복사 → §6-A의 `REVENUECAT_PUBLIC_API_KEY_ANDROID`에 기입.
3. **Products > + New**: §4의 6개 product id를 각각 추가(Store: Play Store, Identifier 동일하게).
   - 소모성 크레딧이라 **Entitlement 연결은 불필요**(Entitlement는 구독/영구권용). Offering도 선택사항 — §6-A는 `getProducts()` 직조회라 Offering 없이 동작. 나중에 A/B 가격 실험을 원하면 Offering으로 승격.
4. **Project Settings > Integrations > Webhooks > + New**:
   - URL: `https://mirilook.com/api/payments/iap-grant`
   - **Authorization header** 값: `Bearer <랜덤 64자 시크릿>` (생성해서 입력) — 같은 값을 Vercel env `REVENUECAT_WEBHOOK_AUTH`에 그대로 등록.
   - Event filter: 최소 `NON_RENEWING_PURCHASE` (전체 수신해도 서버가 skip 처리).
5. (강화 옵션용) **Project Settings > API Keys > Secret key(`sk_...`)** 발급 → Vercel env `REVENUECAT_SECRET_API_KEY`.

### 7.4 라이선스 테스터 + 내부 테스트 트랙

1. Play Console **홈(모든 앱 화면) > 설정 > 라이선스 테스트**: 테스트 Gmail 주소 추가(예: minjae9037@gmail.com) → 응답 "RESPOND_NORMALLY". 여기 등록된 계정은 **실결제 없이** 결제 시트가 뜨고 "테스트 카드" 결제가 가능.
2. 앱 대시보드 → **테스트 > 내부 테스트 > 새 버전 만들기** → 서명된 AAB 업로드(재패키징 후) → 테스터 목록(이메일 리스트) 지정 → 배포.
3. 내부 테스트 **참여 링크**를 테스트 기기의 해당 Gmail 계정으로 열어 수락 → Play 스토어에서 설치.
4. ⚠️ 인앱 상품이 결제 시트에 뜨려면 **AAB가 최소 1개 트랙에 업로드되어 있고 상품이 활성 상태**여야 함. 로컬 사이드로드 APK로는 Billing이 동작하지 않을 수 있음 — 반드시 내부 테스트 트랙 설치본으로 테스트.

---

## 8. 테스트 계획

| # | 시나리오 | 기대 결과 |
|---|---|---|
| 1 | 웹 브라우저에서 /store 열기 | 기존 이니시스 UI 그대로(회귀 없음). `window.Capacitor` 없음 → `isMirilookApp()===false` |
| 2 | 내부 테스트 앱에서 /store 열기 | PG 뱃지·PG 고지 숨김, Google Play 문구로 치환. 콘솔에서 `window.Capacitor.isNativePlatform()` → true |
| 3 | 앱에서 로그인 → `hair_money_4` 구매(라이선스 테스터, 테스트 카드) | Google 결제 시트 → 완료 → 지갑 +4 HM. Supabase `hair_money_ledger`에 `source_type='google_play_iap'`, `source_id=GPA...` 1행 |
| 4 | 같은 구매 직후 RevenueCat 웹훅 도착(대시보드에서 이벤트 확인) | iap-grant가 `already_applied` 응답, 잔액 불변(이중적립 없음) |
| 5 | 클라이언트 POST를 강제로 실패시키고(기내모드 등) 웹훅만 도착 | 웹훅 경로만으로 적립 성공(안전망 검증) |
| 6 | RevenueCat 웹훅 **Send test event** | 서버 200 + `skipped:"TEST"` (오적립 없음) |
| 7 | 결제 시트에서 취소 | "결제를 취소했습니다" 문구, 적립 없음 |
| 8 | 웹에서 이니시스로 충전 → 앱에서 잔액 확인 → 앱에서 추천 사용 | 잔액 합산·차감 정상(공용 지갑 확인) |
| 9 | 로그아웃 상태에서 구매 버튼 | 로그인 유도(웹과 동일), 결제 시트 미노출 |
| 10 | Supabase 검증 쿼리 | `select * from hair_money_ledger where source_type='google_play_iap' order by created_at desc;` / `select balance, total_purchased from hair_money_accounts where profile_id='<uid>';` |

---

## 9. 재패키징 체크리스트 (PG 연결 확정 후, 순서대로)

- [ ] 1. **웹 코드 반영** (apps/web — 이 시점부터 수정 허용):
  - [ ] `src/lib/mirilook-native.ts` 신규 (§2.2)
  - [ ] `src/lib/native-billing.ts` 신규 (§6-A, RevenueCat Public key 기입)
  - [ ] `src/app/api/payments/iap-grant/route.ts` 신규 (§6-C)
  - [ ] `mirilook-hair-money-store.tsx` 게이트 적용 (§6-B + §3.1 표 7개 항목)
  - [ ] `mirilook-payment-panel.tsx` 네이티브 숨김 (§6-B 하단)
- [ ] 2. Vercel env 추가: `REVENUECAT_WEBHOOK_AUTH` (+옵션 `REVENUECAT_SECRET_API_KEY`) → 웹 배포.
- [ ] 3. Play Console: 지급 프로필 → 인앱 상품 6종 생성·활성화 (§7.1).
- [ ] 4. Google Cloud 서비스 계정 JSON → Play Console 권한 부여 (§7.2).
- [ ] 5. RevenueCat: 프로젝트·앱·상품 6종·웹훅 등록, Public API key 확보 (§7.3).
- [ ] 6. `apps/mobile`: `npm install && npx cap sync android` 재실행(이미 플러그인 등록 완료 상태 확인).
- [ ] 7. `versionCode` +1, 서명 AAB 빌드(CI/Codemagic — 이 머신은 SDK 없음) → 내부 테스트 트랙 업로드.
- [ ] 8. 라이선스 테스터 등록 → §8 테스트 1~10 전부 통과.
- [ ] 9. 웹 회귀 확인(테스트 1, 8) — 브라우저 이니시스 결제 정상.
- [ ] 10. 프로덕션 트랙 승격 + 심사 제출 (스토어 등록정보는 PLAY_STORE_PREP.md).
- [ ] 11. 출시 후 모니터링: RevenueCat 대시보드 매출 ↔ `payment_events`(eventType `iap_*`) ↔ `hair_money_ledger` 삼자 대사.

---

### 부록 — 이번 스캐폴딩에서 이미 완료된 것 (2026-07-08)

- `@revenuecat/purchases-capacitor@13.2.1` 설치 (peer: `@capacitor/core >= 8.0.0` — Capacitor 8.4.1과 호환 확인).
- `npx cap sync android` / `npx cap sync ios` 성공 — 양 플랫폼 모두 플러그인 5종에 `@revenuecat/purchases-capacitor@13.2.1` 등록 확인.
- 네이티브 컴파일(gradle/xcodebuild)은 미실행(이 머신에 SDK 없음) — 빌드는 체크리스트 7번에서.
