"use client";

import {
  Check,
  ChevronRight,
  Coins,
  CreditCard,
  Gift,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { MirilookGenerationRefundNotice } from "@/components/mirilook-generation-refund-notice";
import {
  getMirilookAppPlatform,
  useIsMirilookApp,
} from "@/lib/mirilook-native";
import {
  formatHairMoney,
  HairMoneyExtraConsultationCost,
  HairMoneyRecommendationCost,
  HairMoneyRecommendationPriceKrw,
  HairMoneyUnitPriceKrw,
  HairMoneyValidityMonths,
  MirilookHairMoneyProducts,
  toNativeProductId,
} from "@/lib/mirilook-payments";
import {
  ensureNativeBillingReady,
  getNativeHairMoneyProducts,
  isNativeBillingAvailable,
  purchaseNativeHairMoney,
} from "@/lib/native-billing";
import {
  getSupabaseAccessToken,
  getSupabaseBrowserClient,
} from "@/lib/supabase-browser";
import { trackEvent } from "@/lib/mirilook-analytics";

type HairMoneyLedgerItem = {
  amount: number;
  balanceAfter: number;
  createdAt: string;
  direction: "credit" | "debit" | "refund" | "adjustment";
  id: string;
  reason: string | null;
  sourceId: string;
  sourceType: string;
};

type HairMoneyWalletResponse = {
  balance?: number;
  ledger?: HairMoneyLedgerItem[];
  reason?: string;
  recommendationCost?: number;
  synced?: boolean;
};

type InicisPrepareResponse = {
  configured?: boolean;
  jsUrl?: string;
  mode?: string;
  form?: Record<string, string>;
  reason?: string;
};

declare global {
  interface Window {
    INIStdPay?: { pay: (formId: string) => void };
  }
}

// 이니시스 표준결제 JS(INIStdPay) 로드 — 테스트/운영 URL은 서버가 내려준다.
function loadInicisScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window !== "undefined" && window.INIStdPay) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-inicis="1"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("inicis_script_error")),
      );
      if (window.INIStdPay) {
        resolve();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.inicis = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("inicis_script_error"));
    document.head.appendChild(script);
  });
}

// 결제 파라미터를 hidden form에 담아 INIStdPay.pay 호출.
function submitInicisForm(fields: Record<string, string>) {
  const FORM_ID = "SendPayForm_id";
  document.getElementById(FORM_ID)?.remove();

  const form = document.createElement("form");
  form.id = FORM_ID;
  form.method = "POST";
  form.acceptCharset = "UTF-8";

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ?? "";
    form.appendChild(input);
  }

  document.body.appendChild(form);
  window.INIStdPay?.pay(FORM_ID);
}

export function MirilookHairMoneyStore() {
  // 앱(안드로이드) 안에서는 구글 인앱결제로만 판매한다. 디지털 재화를 외부 PG로
  // 앱 안에서 파는 것은 Google Play 결제 정책 위반이라 이니시스 경로를 완전히 차단한다.
  const { isApp, isReady } = useIsMirilookApp();
  // iOS 앱에서 "Google Play" 문구가 뜨면 Apple 심사 반려(3.1.1) → 스토어 이름을 플랫폼별로.
  const storeName = getMirilookAppPlatform() === "ios" ? "App Store" : "Google Play";
  const products = useMemo(() => [...MirilookHairMoneyProducts].reverse(), []);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [wallet, setWallet] = useState<HairMoneyWalletResponse>({
    balance: 0,
    ledger: [],
    recommendationCost: HairMoneyRecommendationCost,
    synced: false,
  });
  const [status, setStatus] = useState("Hair Money 잔액을 확인하는 중입니다.");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? products[0];

  useEffect(() => {
    void refreshWallet();

    // 이니시스 결제 결과(returnUrl 리다이렉트) 처리 — effect 내 직접 setState 회피 위해 지연.
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const result = params.get("payment");
      if (!result) {
        return;
      }

      if (result === "success") {
        setStatus("결제가 완료되었습니다. Hair Money가 적립되었습니다.");
        void reconcileThenRefreshWallet();
      } else if (result === "closed") {
        setStatus("결제를 취소했습니다. 다시 시도할 수 있습니다.");
      } else if (result === "fail") {
        setStatus(
          `결제가 완료되지 않았습니다. (${params.get("reason") ?? "실패"}) 다시 시도해 주세요.`,
        );
      }

      params.delete("payment");
      params.delete("reason");
      params.delete("oid");
      const rest = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${rest ? `?${rest}` : ""}`,
      );
    }, 0);

    return () => window.clearTimeout(timer);
    // 마운트 1회 실행(결제 복귀 처리) — 내부 헬퍼는 최신 클로저를 참조하므로 의존성 제외.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 승인은 됐으나 적립이 끊긴 주문 보정 후 잔액 새로고침(안전망).
  async function reconcileThenRefreshWallet() {
    try {
      const token = await getSupabaseAccessToken();
      if (token) {
        await fetch("/api/payments/inicis/reconcile/", {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
        }).catch(() => null);
      }
    } finally {
      await refreshWallet();
    }
  }

  async function refreshWallet() {
    setIsLoadingWallet(true);
    setNeedsLogin(false);

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setNeedsLogin(true);
        setWallet({
          balance: 0,
          ledger: [],
          recommendationCost: HairMoneyRecommendationCost,
          synced: false,
        });
        setStatus(
          "로그인하면 보유 Hair Money와 결제/사용 내역이 계정에 연결됩니다.",
        );
        return;
      }

      const response = await fetch("/api/payments/hair-money/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = (await response.json().catch(() => ({
        balance: 0,
        ledger: [],
        reason: `server_${response.status}`,
        synced: false,
      }))) as HairMoneyWalletResponse;

      setWallet({
        ...result,
        ledger: result.ledger ?? [],
      });
      setNeedsLogin(result.reason === "not_authenticated");
      setStatus(buildWalletStatus(result));
    } catch (error) {
      console.error(error);
      setStatus("Hair Money 잔액 확인이 지연되고 있습니다.");
    } finally {
      setIsLoadingWallet(false);
    }
  }

  // 앱: Google Play 결제 시트 → 서버 적립(iap-grant). 이니시스 경로는 절대 타지 않는다.
  async function startNativePayment(product = selectedProduct) {
    if (!product) {
      return;
    }

    setIsPaying(true);
    setNeedsLogin(false);
    setStatus(`${storeName} 결제를 준비하는 중입니다.`);
    trackEvent("checkout_started", {
      amount: product.amount,
      productId: product.id,
    });

    try {
      const token = await getSupabaseAccessToken();
      const session = await getSupabaseBrowserClient()?.auth.getSession();
      const profileId = session?.data.session?.user.id ?? null;

      if (!token || !profileId) {
        setNeedsLogin(true);
        setStatus("Hair Money 충전은 로그인된 계정에 적립됩니다.");
        return;
      }

      if (!isNativeBillingAvailable()) {
        setStatus(
          "앱 결제 모듈을 불러오지 못했습니다. 앱을 최신 버전으로 업데이트한 뒤 다시 시도해 주세요.",
        );
        return;
      }

      await ensureNativeBillingReady(profileId);

      const nativeProductId = toNativeProductId(product.id);
      const nativeProducts = await getNativeHairMoneyProducts();
      const nativeProduct = nativeProducts.find(
        (item) => item.identifier === nativeProductId,
      );

      if (!nativeProduct) {
        setStatus("상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      const grant = await purchaseNativeHairMoney({
        accessToken: token,
        product: nativeProduct,
      });

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
        setStatus(
          `${storeName} 결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.`,
        );
      }
    } finally {
      setIsPaying(false);
    }
  }

  async function startPayment(product = selectedProduct) {
    if (!product) {
      return;
    }

    // 네이티브 분기는 최상단 — 아래 이니시스 경로로 절대 흘러가면 안 된다.
    if (isApp) {
      await startNativePayment(product);
      return;
    }

    setIsPaying(true);
    setNeedsLogin(false);
    setStatus(`${product.name} 결제 정보를 준비하는 중입니다.`);
    trackEvent("checkout_started", {
      amount: product.amount,
      productId: product.id,
    });

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setNeedsLogin(true);
        setStatus("Hair Money 충전은 로그인된 계정에 적립됩니다.");
        return;
      }

      const response = await fetch("/api/payments/inicis/prepare/", {
        body: JSON.stringify({ productId: product.id }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const prepare = (await response.json().catch(() => ({
        reason: `server_${response.status}`,
      }))) as InicisPrepareResponse;

      if (!response.ok || !prepare.configured || !prepare.form || !prepare.jsUrl) {
        setStatus(getCheckoutErrorMessage(prepare.reason));
        setNeedsLogin(prepare.reason === "not_authenticated");
        return;
      }

      // 이니시스 표준결제창(INIStdPay) 호출. 결과는 서버 returnUrl → /store?payment=... 로 수신.
      await loadInicisScript(prepare.jsUrl);
      setStatus("결제창을 여는 중입니다...");
      submitInicisForm(prepare.form);
    } catch (error) {
      console.error(error);
      setStatus(getPaymentClientErrorMessage(error));
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-5">
        <section className="rounded-md border border-[#2b281f] bg-[#171511]/92 p-4 shadow-2xl shadow-black/35 backdrop-blur md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <Wallet aria-hidden="true" className="text-[#f3d28a]" size={19} />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f3d28a]">
                  Store Balance
                </p>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-[#fffaf1] md:text-2xl">
                Hair Money를 충전하세요
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
                결제가 확인되면 로그인한 계정 지갑에 즉시 적립됩니다.
                헤어스타일 추천을 요청할 때마다 {HairMoneyRecommendationCost} HM
                ({HairMoneyRecommendationPriceKrw.toLocaleString("ko-KR")}원, VAT 포함
                기준)이 차감되고, 생성 결과와 사용 내역으로 기록됩니다.
              </p>
              <MirilookGenerationRefundNotice className="mt-3" />
            </div>

            <button
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#c9a96a]/45 bg-[#201a12]/78 px-4 text-sm font-bold text-[#f3d28a] transition hover:bg-[#2b2216] md:w-fit"
              onClick={() => void refreshWallet()}
              type="button"
            >
              {isLoadingWallet ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={17} />
              ) : (
                <RefreshCw aria-hidden="true" size={17} />
              )}
              잔액 새로고침
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <SummaryTile
              icon={<CoinMark />}
              label="보유 Hair Money"
              value={isLoadingWallet ? "확인 중" : `${formatHairMoney(wallet.balance)} HM`}
            />
            <SummaryTile
              label="추천 1회 차감"
              value={`${HairMoneyRecommendationCost} HM`}
              helper={
                <>
                  {HairMoneyRecommendationPriceKrw.toLocaleString("ko-KR")}원 VAT
                  포함 기준
                </>
              }
            />
            <SummaryTile
              label="선택 상품"
              value={`${formatHairMoney(selectedProduct?.hairMoneyAmount)} HM`}
              helper={<>{(selectedProduct?.amount ?? 0).toLocaleString("ko-KR")}원</>}
            />
          </div>
        </section>

        <section className="rounded-md border border-[#2b281f] bg-[#171511]/92 p-4 shadow-2xl shadow-black/35 backdrop-blur md:p-5">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Coins aria-hidden="true" className="text-[#f3d28a]" size={18} />
                <h2 className="text-lg font-semibold text-[#fffaf1]">
                  충전 패키지
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
                같은 원화로 더 많은 Hair Money를 드립니다 — 충전 금액이 클수록 최대 약 26.5%까지
                추가 적립됩니다. (1 Hair Money 정가 환산 {HairMoneyUnitPriceKrw.toLocaleString("ko-KR")}원, VAT 포함)
                충전한 Hair Money는 회원 계정에 적립되고 추천 사용 시 차감됩니다.
              </p>
            </div>
            <span className="w-fit rounded-md border border-[#f3d28a]/30 bg-[#30271a]/60 px-3 py-2 text-xs font-bold text-[#f3d28a]">
              {isApp ? `${storeName} 결제` : "KG이니시스 PG"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
            {products.map((product) => {
              const selected = product.id === selectedProduct?.id;
              const listPriceKrw =
                (product.hairMoneyAmount ?? 0) * HairMoneyUnitPriceKrw;
              const hasDiscount = listPriceKrw > product.amount;
              const discountPercent = hasDiscount
                ? formatDiscountPercent((1 - product.amount / listPriceKrw) * 100)
                : null;
              const perUnitKrw = product.hairMoneyAmount
                ? Math.floor(product.amount / product.hairMoneyAmount)
                : HairMoneyUnitPriceKrw;

              return (
                <button
                  aria-pressed={selected}
                  className={`min-w-0 rounded-md border p-3 text-left transition sm:p-4 ${
                    selected
                      ? "border-[#f3d28a] bg-[#30271a]/82 shadow-lg shadow-[#f3d28a]/5"
                      : "border-white/10 bg-[#0f0e0c]/72 hover:border-[#f3d28a]/45 hover:bg-[#15130f]"
                  }`}
                  key={product.id}
                  onClick={() => {
                    // 상품 클릭 = 즉시 결제창(하트스코어와 동일). state 갱신은 비동기라
                    // 방금 클릭한 product를 직접 넘겨 이전 선택이 결제되는 것을 막는다.
                    setSelectedProductId(product.id);
                    if (isReady && !isPaying) {
                      void startPayment(product);
                    }
                  }}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CoinMark />
                        <p className="truncate text-sm font-semibold text-[#fffaf1]">
                          Hair Money
                        </p>
                      </div>
                      <p className="mt-3 text-2xl font-black text-[#fffaf1] sm:text-3xl">
                        {formatHairMoney(product.hairMoneyAmount)}
                        {discountPercent ? (
                          <span className="ml-1.5 inline-block rounded-md bg-[#1f9d57] px-1.5 py-0.5 align-middle text-[10px] font-extrabold text-white sm:ml-2 sm:text-xs">
                            {discountPercent}% 할인
                          </span>
                        ) : null}
                      </p>
                    </div>
                    {product.badge ? (
                      <span className="shrink-0 rounded-md border border-[#25c7f2]/35 bg-[#123544] px-2 py-1 text-xs font-bold text-[#9ae8ff]">
                        {product.badge}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#b8aa95]">
                    {product.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.perks.map((perk) => (
                      <span
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-semibold text-[#d8cbb8]"
                        key={perk}
                      >
                        {perk}
                      </span>
                    ))}
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-semibold text-[#d8cbb8]">
                      1 Hair Money = {perUnitKrw.toLocaleString("ko-KR")}원 (VAT 포함)
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                      {hasDiscount ? (
                        <span className="text-xs font-semibold text-[#8f826f] line-through decoration-[#ff5c8a] decoration-2 sm:text-sm">
                          {listPriceKrw.toLocaleString("ko-KR")}원
                        </span>
                      ) : null}
                      <span className="text-lg font-bold text-[#f3d28a] sm:text-xl">
                        {product.amount.toLocaleString("ko-KR")}원
                      </span>
                    </span>
                    <span
                      className={`inline-flex size-7 items-center justify-center rounded-md border ${
                        selected
                          ? "border-[#f3d28a] bg-[#f3d28a] text-[#1a1712]"
                          : "border-white/10 text-[#8f826f]"
                      }`}
                    >
                      <Check aria-hidden="true" size={15} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <LedgerSection ledger={wallet.ledger ?? []} />

        <section className="rounded-md border border-[#c9a96a]/40 bg-[#0f0e0c]/72 p-4">
          <a
            className="flex w-full items-center justify-between gap-3 text-left transition hover:opacity-90"
            href="/community"
          >
            <span className="inline-flex min-w-0 items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-[#241d14] text-[#f3d28a]">
                <Gift aria-hidden="true" size={20} />
              </span>
              <span>
                <span className="block text-sm font-bold text-[#fffaf1]">
                  무료 Hair Money 미션 — 피드 공유
                </span>
                <span className="mt-1 block text-sm text-[#8f826f]">
                  커뮤니티 피드에 사진·상담 결과를 공유하면 게시글마다 Hair Money
                  1개를 드립니다.
                </span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#f3d28a]">
              +1 적립
              <ChevronRight aria-hidden="true" size={16} />
            </span>
          </a>
        </section>
      </div>

      <aside className="grid h-fit gap-4 rounded-md border border-[#2b281f] bg-[#171511]/92 p-4 shadow-2xl shadow-black/35 backdrop-blur md:p-5 xl:sticky xl:top-5">
        <div className="flex items-center gap-2">
          <CreditCard aria-hidden="true" className="text-[#f3d28a]" size={18} />
          <h2 className="text-lg font-semibold text-[#fffaf1]">결제 확인</h2>
        </div>

        <div className="rounded-md border border-[#f3d28a]/30 bg-[#30271a]/55 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b8aa95]">
            Selected
          </p>
          <p className="mt-2 text-lg font-bold text-[#fffaf1]">
            {selectedProduct?.name}
          </p>
          <p className="mt-1 text-sm text-[#f3d28a]">
            {(selectedProduct?.amount ?? 0).toLocaleString("ko-KR")}원 ·{" "}
            {formatHairMoney(selectedProduct?.hairMoneyAmount)} Hair Money
          </p>
        </div>

        {/* isReady 전에는 웹/앱 분기가 확정되지 않는다(SSR HTML은 항상 웹 모드).
            결제 버튼은 확정 전까지 비활성 — 앱에서 이니시스 경로가 스치는 것을 원천 차단. */}
        <button
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#f3d28a] px-4 text-sm font-bold text-[#1a1712] transition hover:bg-[#ffdf98] disabled:cursor-not-allowed disabled:bg-[#4a412e] disabled:text-[#b8aa95]"
          disabled={isPaying || !isReady}
          onClick={() => void startPayment()}
          type="button"
        >
          {isPaying || !isReady ? (
            <Loader2 aria-hidden="true" className="animate-spin" size={17} />
          ) : (
            <CreditCard aria-hidden="true" size={17} />
          )}
          Hair Money 충전하기
        </button>

        {needsLogin ? (
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#c9a96a]/50 px-3 text-sm font-bold text-[#f3d28a] transition hover:bg-[#f3d28a]/10"
            href="/login"
          >
            로그인하고 충전하기
          </Link>
        ) : null}

        {/* 결제 경로별 필수 고지 — 웹은 PG(이니시스), 앱은 Google Play 정책. */}
        <div className="rounded-md border border-[#f3d28a]/45 bg-[#f3d28a]/10 p-3">
          <div className="flex items-center gap-2">
            <Info aria-hidden="true" className="text-[#f3d28a]" size={16} />
            <p className="text-sm font-bold text-[#fffaf1]">충전 전 필수 확인</p>
          </div>
          <ul className="mt-2 grid gap-1.5 text-xs leading-5 text-[#e7dccb]">
            <li>
              · 충전한 Hair Money의 사용기간(유효기간)은 충전일로부터{" "}
              <b className="text-[#fffaf1]">{HairMoneyValidityMonths / 12}년</b>
              입니다. 기간이 지나면 소멸될 수 있습니다.
            </li>
            {isApp ? (
              <li>
                · 구매·환불은 <b className="text-[#fffaf1]">{storeName} 결제 정책</b>
                을 따르며, 환불은 {storeName} 주문내역에서 신청할 수 있습니다.
              </li>
            ) : (
              <>
                <li>
                  · 환불은 <b className="text-[#fffaf1]">최초 결제하신 결제수단</b>
                  (카드 등)으로만 가능합니다.
                </li>
                <li>
                  · 구매 후 <b className="text-[#fffaf1]">7일 이내</b> 사용하지 않은
                  Hair Money는 청약철회(취소·환불)할 수 있습니다.
                </li>
              </>
            )}
          </ul>
        </div>

        <p className="rounded-md border border-white/10 bg-[#0f0e0c]/72 px-3 py-2 text-sm leading-6 text-[#b8aa95]">
          {status}
        </p>

        <div className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="text-[#b7e3bb]" size={17} />
            <p className="text-sm font-bold text-[#fffaf1]">사용처 및 사용 규칙</p>
          </div>
          <div className="mt-3 grid gap-2 text-sm leading-6 text-[#b8aa95]">
            <p className="flex gap-2">
              <Check aria-hidden="true" className="mt-1 shrink-0 text-[#b7e3bb]" size={15} />
              Hair Money는 미리룩의 유료 기능에 사용합니다 — 헤어스타일 추천,
              AI 상담용 이미지(9방향) 생성, 코디 추천 등.
            </p>
            <p className="flex gap-2">
              <Check aria-hidden="true" className="mt-1 shrink-0 text-[#b7e3bb]" size={15} />
              헤어 추천 1회 {HairMoneyRecommendationCost} Hair Money, 추가 상담
              세트(9방향) 생성 1회 {HairMoneyExtraConsultationCost} Hair Money가
              차감됩니다.
            </p>
            <p className="flex gap-2">
              <Check aria-hidden="true" className="mt-1 shrink-0 text-[#b7e3bb]" size={15} />
              1 Hair Money는 {HairMoneyUnitPriceKrw.toLocaleString("ko-KR")}원(VAT 포함)이며,
              추천 1회는 {HairMoneyRecommendationPriceKrw.toLocaleString("ko-KR")}원(VAT 포함)
              기준입니다.
            </p>
            <p className="flex gap-2">
              <Check aria-hidden="true" className="mt-1 shrink-0 text-[#b7e3bb]" size={15} />
              충전한 Hair Money의 사용기간(유효기간)은 충전일로부터{" "}
              {HairMoneyValidityMonths / 12}년입니다.
            </p>
            <p className="flex gap-2">
              <Check aria-hidden="true" className="mt-1 shrink-0 text-[#b7e3bb]" size={15} />
              결제 승인·금액·통화가 모두 맞을 때만 계정 지갑에 적립되며,
              사용·적립 내역은 마이페이지에서 확인할 수 있습니다.
            </p>
          </div>
        </div>

        <RefundPolicy isApp={isApp} />
      </aside>
    </section>
  );
}

function LedgerSection({ ledger }: { ledger: HairMoneyLedgerItem[] }) {
  return (
    <section className="rounded-md border border-[#2b281f] bg-[#171511]/92 p-4 shadow-2xl shadow-black/35 backdrop-blur md:p-5">
      <div className="flex items-center gap-2">
        <Wallet aria-hidden="true" className="text-[#f3d28a]" size={18} />
        <h2 className="text-lg font-semibold text-[#fffaf1]">최근 적립/차감 내역</h2>
      </div>

      {ledger.length ? (
        <div className="mt-4 grid gap-2">
          {ledger.map((item) => (
            <div
              className="grid gap-2 rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3 md:grid-cols-[120px_minmax(0,1fr)_auto]"
              key={item.id}
            >
              <span
                className={`w-fit rounded-md px-2 py-1 text-xs font-bold ${
                  item.direction === "debit"
                    ? "bg-[#3a1c1c] text-[#ffb3a6]"
                    : "bg-[#17351f] text-[#b7e3bb]"
                }`}
              >
                {getLedgerDirectionLabel(item.direction)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#fffaf1]">
                  {getLedgerReasonLabel(item)}
                </p>
                <p className="mt-1 text-xs text-[#8f826f]">
                  {formatLedgerDate(item.createdAt)} · 잔액 {formatHairMoney(item.balanceAfter)} HM
                </p>
              </div>
              <p
                className={`text-right text-sm font-bold ${
                  item.direction === "debit" ? "text-[#ffb3a6]" : "text-[#b7e3bb]"
                }`}
              >
                {item.direction === "debit" ? "-" : "+"}
                {formatHairMoney(item.amount)} HM
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3 text-sm leading-6 text-[#8f826f]">
          아직 Hair Money 적립/차감 내역이 없습니다. 충전 후 추천을 요청하면 이곳에 기록됩니다.
        </p>
      )}
    </section>
  );
}

function SummaryTile({
  helper,
  icon,
  label,
  value,
}: {
  // 숫자를 문자열로 이어붙이면 "55,000원"이 통째로 한 텍스트 노드가 돼
  // 런타임 번역 사전에 걸리지 않는다. JSX로 받아 단위만 별도 노드로 남긴다.
  helper?: ReactNode;
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8f826f]">
          {label}
        </p>
      </div>
      <p className="mt-3 truncate text-2xl font-bold text-[#fffaf1]">{value}</p>
      {helper ? <p className="mt-1 text-xs font-semibold text-[#8f826f]">{helper}</p> : null}
    </div>
  );
}

function CoinMark() {
  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-[#f3d28a]/40 bg-[#30271a] text-[#f3d28a]">
      <Coins aria-hidden="true" size={17} />
    </span>
  );
}

function RefundPolicy({ isApp }: { isApp: boolean }) {
  const storeName =
    getMirilookAppPlatform() === "ios" ? "App Store" : "Google Play";
  return (
    <section className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3">
      <div className="flex items-center gap-2">
        <Sparkles aria-hidden="true" className="text-[#f3d28a]" size={17} />
        <h2 className="text-sm font-bold text-[#fffaf1]">환불 정책 요약</h2>
      </div>
      <ul className="mt-3 grid gap-2 text-xs leading-5 text-[#8f826f]">
        <li>· Hair Money는 유상 충전 사이버머니이며 현재 충전 기준은 1 Hair Money당 {HairMoneyUnitPriceKrw.toLocaleString("ko-KR")}원(VAT 포함)입니다.</li>
        {isApp ? (
          <li>· 구매·환불은 {storeName} 결제 정책을 따르며, 환불은 {storeName} 주문내역에서 신청할 수 있습니다.</li>
        ) : (
          <>
            <li>· 구매 후 7일 이내 사용하지 않은 유상 Hair Money는 청약철회(취소)하여 환불받을 수 있습니다.</li>
            <li>· 환불은 최초 결제하신 결제수단(카드 등)으로만 이루어집니다.</li>
          </>
        )}
        <li>· 충전한 유상 Hair Money의 사용기간(유효기간)은 충전일로부터 {HairMoneyValidityMonths / 12}년입니다.</li>
        <li>· 헤어 추천, 이미지 생성, 투표/상담 등 서비스 이용으로 이미 차감된 Hair Money는 원칙적으로 환불 대상에서 제외됩니다.</li>
        <li>· AI 생성 오류 환불은 자동 처리되지 않으며, 회사 귀책 또는 법령상 환불 사유가 확인되는 경우 접수 후 검토합니다.</li>
        {isApp ? (
          <li>· 부정 결제, 중복 결제, 미성년자 결제 등은 결제 내역과 운영 정책에 따라 별도로 확인합니다.</li>
        ) : (
          <li>· 부정 결제, 중복 결제, 미성년자 결제 등은 카드 결제 내역과 운영 정책에 따라 별도로 확인합니다.</li>
        )}
      </ul>
      <p className="mt-3 text-xs leading-5 text-[#8f826f]">
        자세한 내용은{" "}
        <Link className="font-semibold text-[#f3d28a] underline" href="/refund">
          취소·환불·교환 정책
        </Link>
        에서 확인하실 수 있습니다.
      </p>
      <MirilookGenerationRefundNotice className="mt-3" />
    </section>
  );
}

// 정가 대비 할인율(%)을 소수 첫째 자리까지 표시하되, 정수면 소수점을 생략한다. (예: 16.7, 25)
function formatDiscountPercent(percent: number) {
  const rounded = Math.round(percent * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

function buildWalletStatus(result: HairMoneyWalletResponse) {
  if (result.synced) {
    return `현재 사용 가능한 Hair Money는 ${formatHairMoney(result.balance)} HM입니다.`;
  }

  if (result.reason === "not_authenticated") {
    return "로그인하면 보유 Hair Money와 결제 내역이 계정에 연결됩니다.";
  }

  if (result.reason === "supabase_not_configured") {
    return "Hair Money 저장소 연결이 필요합니다.";
  }

  return "Hair Money 잔액 확인이 지연되고 있습니다.";
}

function getCheckoutErrorMessage(reason: string | undefined) {
  switch (reason) {
    case "not_authenticated":
      return "Hair Money 충전은 로그인된 계정에 적립됩니다.";
    case "supabase_not_configured":
      return "Hair Money 저장을 위한 Supabase 연결이 필요합니다.";
    case "supabase_upsert_failed":
      return "결제 주문 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    case "inicis_not_ready":
      return "웹 결제는 준비 중입니다. 앱에서 결제하거나 잠시 후 다시 시도해 주세요.";
    default:
      return "결제 정보를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
}

function getPaymentClientErrorMessage(error: unknown) {
  const details = readClientPaymentError(error);

  if (!details) {
    return "결제 처리 중 오류가 발생했습니다. 팝업 차단 여부를 확인한 뒤 다시 시도해 주세요.";
  }

  if (details.code === "CANCELED" || details.code === "Cancelled") {
    return "결제가 취소되었습니다. 다시 충전하려면 결제 버튼을 눌러 주세요.";
  }

  return `결제창 호출 중 오류가 발생했습니다. ${details.code ? `[${details.code}] ` : ""}${details.message}`;
}

function readClientPaymentError(error: unknown) {
  if (!error || typeof error !== "object") {
    return null;
  }

  const record = error as Record<string, unknown>;
  const message =
    typeof record.pgMessage === "string"
      ? record.pgMessage
      : typeof record.message === "string"
        ? record.message
        : error instanceof Error
          ? error.message
          : "";

  if (!message) {
    return null;
  }

  return {
    code: typeof record.code === "string" ? record.code : undefined,
    message: message.slice(0, 180),
  };
}

function getLedgerDirectionLabel(direction: HairMoneyLedgerItem["direction"]) {
  switch (direction) {
    case "credit":
      return "적립";
    case "debit":
      return "차감";
    case "refund":
      return "환불";
    default:
      return "조정";
  }
}

function getLedgerReasonLabel(item: HairMoneyLedgerItem) {
  // 결제수단 중립 표기 — 웹(카드)에서 충전한 내역이 앱에도 그대로 보이므로,
  // 라벨에 결제수단을 적으면 앱 안에서 외부 결제를 노출하는 모양이 된다.
  switch (item.reason) {
    case "hair_money_purchase":
      return "Hair Money 충전";
    case "style_recommendation":
      return "헤어스타일 추천 사용";
    case "extra_consultation_set":
      return "추가 상담 이미지 생성 사용";
    case "community_post_reward":
      return "커뮤니티 피드 공유 보상";
    case "style_recommendation_failed_refund":
    case "style_recommendation_refund":
      return "추천 실패/검토 환불";
    default:
      return item.reason || item.sourceType;
  }
}

function formatLedgerDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
