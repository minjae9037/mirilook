import type { MirilookLocale } from "@/lib/mirilook-i18n";

// 원화 가격 옆에 보여줄 외화 환산.
//
// 왜 고정 환율인가: 실제 청구는 언제나 원화(웹=이니시스, 앱=스토어 통화)로 이뤄지고,
// 여기 표시는 "대략 얼마인지" 감을 주기 위한 참고값일 뿐이다. 결제 직전에 실시간
// 환율을 불러오면 화면 금액과 청구 금액이 미묘하게 달라져 분쟁 소지만 커진다.
// 그래서 기준일을 함께 표기하고, 환율이 크게 움직이면 이 상수만 갱신한다.
//
// 출처: 유럽중앙은행(ECB) 참고환율 — api.frankfurter.dev (2026-07-21 기준).
// 교차검증: open.er-api.com 동일 일자 값과 0.5% 이내 일치.
export const mirilookFxBaseDate = "2026-07-21";

// 외화 1단위당 원화. (예: 1 USD = 1,478.4 KRW)
const krwPerUnit = {
  usd: 1478.4,
  jpy: 9.084, // ECB: 1 USD = 162.74 JPY 로 환산
  cny: 218.51, // ECB: 1 USD = 6.7661 CNY 로 환산
} as const;

type ForeignCurrency = keyof typeof krwPerUnit;

const localeCurrency: Partial<Record<MirilookLocale, ForeignCurrency>> = {
  en: "usd",
  ja: "jpy",
  zh: "cny",
};

const currencyFormat: Record<
  ForeignCurrency,
  { locale: string; currency: string; maximumFractionDigits: number }
> = {
  // 달러·위안은 소수점 둘째 자리까지, 엔은 소수점을 쓰지 않는 통화라 정수로.
  usd: { locale: "en-US", currency: "USD", maximumFractionDigits: 2 },
  jpy: { locale: "ja-JP", currency: "JPY", maximumFractionDigits: 0 },
  cny: { locale: "zh-CN", currency: "CNY", maximumFractionDigits: 2 },
};

/**
 * 원화 금액을 해당 언어권 통화로 환산한 문자열("≈ $37.20")을 만든다.
 * 한국어(ko)이거나 금액이 없으면 null — 환산 표기를 아예 렌더링하지 않는다.
 */
export function formatApproxForeignPrice(
  amountKrw: number,
  locale: MirilookLocale,
) {
  const currency = localeCurrency[locale];

  if (!currency || !Number.isFinite(amountKrw) || amountKrw <= 0) {
    return null;
  }

  const format = currencyFormat[currency];
  const converted = amountKrw / krwPerUnit[currency];
  const rounded = new Intl.NumberFormat(format.locale, {
    currency: format.currency,
    maximumFractionDigits: format.maximumFractionDigits,
    minimumFractionDigits: format.maximumFractionDigits === 0 ? 0 : 2,
    style: "currency",
  }).format(converted);

  return `≈ ${rounded}`;
}
