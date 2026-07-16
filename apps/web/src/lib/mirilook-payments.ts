export type MirilookPaymentProduct = {
  amount: number;
  badge?: string;
  badgeTone?: "blue" | "gold";
  description: string;
  discountLabel?: string;
  entitlement?: "premium_addons" | "vote_boost" | "salon_pack";
  entitlementDays?: number;
  hairMoneyAmount?: number;
  id: string;
  name: string;
  perks: string[];
  productKind: "entitlement" | "hair_money";
};

export const HairMoneyVatRate = 0.1;
export const HairMoneyUnitNetPriceKrw = 500;
export const HairMoneyUnitPriceKrw = getVatIncludedKrw(HairMoneyUnitNetPriceKrw);
export const HairMoneyRecommendationCost = 4;
export const HairMoneyRecommendationPriceKrw =
  HairMoneyRecommendationCost * HairMoneyUnitPriceKrw;

// One recommendation cycle includes the first consultation set (9 angles) for
// free. Generating an additional set for a different recommended style costs
// this many Hair Money units, charged with a confirmation prompt.
export const HairMoneyExtraConsultationCost = 2;
export const HairMoneyExtraConsultationPriceKrw =
  HairMoneyExtraConsultationCost * HairMoneyUnitPriceKrw;

// Community reward: sharing a photo/result to the public feed grants this many
// Hair Money units, once per published post (idempotent on the post id).
export const HairMoneyCommunityPostReward = 1;

// 유상 Hair Money 사용기간(유효기간) — 충전일로부터 개월 수. PG(이니시스) 고지 필수.
export const HairMoneyValidityMonths = 12;

export const MirilookEntitlementProducts: MirilookPaymentProduct[] = [
  {
    id: "premium-style-report",
    name: "프리미엄 스타일 리포트",
    amount: 1900,
    description:
      "헤어 추천에 코디 조언을 붙여 더 구체적인 상담 자료를 만듭니다.",
    entitlement: "premium_addons",
    entitlementDays: 30,
    productKind: "entitlement",
    perks: ["코디 추천", "PDF/공유 상담 보드 반영"],
  },
  {
    id: "vote-boost-30",
    name: "스타일 투표 30명",
    amount: 3000,
    description:
      "추천받은 스타일을 파일럿 투표 대상에게 노출하고 결과를 모읍니다.",
    entitlement: "vote_boost",
    entitlementDays: 14,
    productKind: "entitlement",
    perks: ["이성 투표 요청", "댓글 피드백", "결과 요약"],
  },
  {
    id: "vote-boost-80",
    name: "스타일 투표 80명",
    amount: 7900,
    description:
      "더 많은 투표자에게 노출하고 DM 허용 여부를 선택할 수 있는 패키지입니다.",
    entitlement: "vote_boost",
    entitlementDays: 14,
    productKind: "entitlement",
    perks: ["투표 우선 노출", "DM 정책 선택", "목적별 결과 요약"],
  },
  {
    id: "salon-premium-pack",
    name: "미용실 상담 패키지",
    amount: 9900,
    description:
      "상담 보드 저장, 이메일 공유, 예약 문의를 묶은 프리미엄 파일럿 패키지입니다.",
    entitlement: "salon_pack",
    entitlementDays: 30,
    productKind: "entitlement",
    perks: ["상담 보드 저장", "미용실 이메일 공유", "예약 문의 연동"],
  },
];

// 원화 가격은 고정하고, 충전량이 클수록 더 많은 Hair Money를 지급(정가=HM수량×단가 대비 할인).
// 할인율은 store UI에서 (정가 대비) 자동 계산해 표시한다.
export const MirilookHairMoneyProducts: MirilookPaymentProduct[] = [
  {
    id: "hair-money-2000",
    name: "Hair Money 4",
    amount: 2200,
    description:
      "헤어스타일 추천 1회를 바로 테스트할 수 있는 최소 충전 패키지입니다.",
    hairMoneyAmount: 4,
    productKind: "hair_money",
    perks: ["스타일 추천 1회"],
  },
  {
    id: "hair-money-10000",
    name: "Hair Money 24",
    amount: 11000,
    description:
      "여러 장의 사진과 다른 추천 기준을 반복 테스트하기 좋은 기본 패키지입니다.",
    hairMoneyAmount: 24,
    productKind: "hair_money",
    perks: ["스타일 추천 6회"],
  },
  {
    id: "hair-money-20000",
    name: "Hair Money 52",
    amount: 22000,
    description:
      "상담 전후 비교와 다른 컬러·기장 기준을 넉넉히 테스트할 수 있습니다.",
    hairMoneyAmount: 52,
    productKind: "hair_money",
    perks: ["스타일 추천 13회"],
  },
  {
    id: "hair-money-30000",
    name: "Hair Money 80",
    amount: 33000,
    description:
      "미용실 상담 테스트나 여러 고객 비교를 위한 운영형 충전 패키지입니다.",
    hairMoneyAmount: 80,
    productKind: "hair_money",
    perks: ["스타일 추천 20회"],
  },
  {
    id: "hair-money-40000",
    name: "Hair Money 108",
    amount: 44000,
    description:
      "반복 상담, 코디 확장 기능 테스트까지 고려한 패키지입니다.",
    hairMoneyAmount: 108,
    productKind: "hair_money",
    perks: ["스타일 추천 27회"],
  },
  {
    id: "hair-money-50000",
    name: "Hair Money 136",
    amount: 55000,
    description:
      "팀 단위 테스트와 파일럿 운영에 맞춘 최대 충전 패키지입니다.",
    hairMoneyAmount: 136,
    productKind: "hair_money",
    perks: ["스타일 추천 34회"],
  },
];

export const MirilookPaymentProducts: MirilookPaymentProduct[] = [
  ...MirilookEntitlementProducts,
  ...MirilookHairMoneyProducts,
];

export function getPaymentProduct(productId: string | undefined) {
  return MirilookPaymentProducts.find((product) => product.id === productId);
}

/**
 * Google Play 인앱 상품 id는 생성 후 변경할 수 없다. 그래서 수량·가격처럼 바뀔 수 있는
 * 값이 아니라, 웹 상품의 안정적인 id에서 기계적으로 파생한다.
 * (Play 상품 id 규칙: 소문자·숫자·밑줄·마침표 → 하이픈만 밑줄로 치환.)
 *
 *   hair-money-2000 → hair_money_2000
 *
 * Play Console·RevenueCat에 만드는 상품 id는 반드시 이 결과와 같아야 한다. 수량을 id에
 * 넣지 않는 이유: 볼륨 할인 조정으로 패키지별 HM 수량이 이미 한 번 바뀐 전례가 있다.
 */
export function toNativeProductId(webProductId: string) {
  return webProductId.replace(/-/g, "_");
}

/** 네이티브(Google Play) 상품 id → 웹 Hair Money 상품. 매칭 없으면 undefined. */
export function getHairMoneyProductFromNativeProductId(
  nativeProductId: string | undefined,
) {
  if (!nativeProductId) {
    return undefined;
  }

  return MirilookHairMoneyProducts.find(
    (product) => toNativeProductId(product.id) === nativeProductId,
  );
}

export function getPaymentProductFromPaymentId(paymentId: string | undefined) {
  if (!paymentId) {
    return undefined;
  }

  return MirilookPaymentProducts.find((product) =>
    paymentId.startsWith(`mirilook-${product.id}-`),
  );
}

export function getEntitlementExpiresAt(product: MirilookPaymentProduct) {
  const days = product.entitlementDays ?? 30;

  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function formatHairMoney(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("ko-KR");
}

export function getVatIncludedKrw(netAmountKrw: number) {
  return Math.round(netAmountKrw * (1 + HairMoneyVatRate));
}
