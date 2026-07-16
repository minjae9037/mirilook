"use client";

import { CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useIsMirilookApp } from "@/lib/mirilook-native";
import { MirilookPaymentProducts } from "@/lib/mirilook-payments";
import { getSupabaseAccessToken } from "@/lib/supabase-browser";

type InicisPrepareResponse = {
  configured?: boolean;
  jsUrl?: string;
  mode?: string;
  form?: Record<string, string>;
  reason?: string;
};

type MirilookPaymentPanelProps = {
  description?: string;
  initialProductId?: string;
  onPaymentRecorded?: () => void;
  productIds?: string[];
  title?: string;
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

export function MirilookPaymentPanel({
  description = "결제 후 스타일 투표 노출, DM 정책, 상담 공유를 연결하기 위한 KG이니시스 결제 영역입니다.",
  initialProductId,
  onPaymentRecorded,
  productIds,
  title = "유료 투표 / 상담 패키지",
}: MirilookPaymentPanelProps = {}) {
  const { isApp } = useIsMirilookApp();
  const availableProducts = useMemo(() => {
    if (!productIds?.length) {
      return MirilookPaymentProducts;
    }

    const allowedProductIds = new Set(productIds);

    return MirilookPaymentProducts.filter((product) =>
      allowedProductIds.has(product.id),
    );
  }, [productIds]);

  const fallbackProductId =
    initialProductId &&
    availableProducts.some((product) => product.id === initialProductId)
      ? initialProductId
      : availableProducts[0]?.id ?? "";

  const [selectedProductId, setSelectedProductId] = useState(fallbackProductId);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [status, setStatus] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // 이니시스 결제창은 전체 페이지를 이동한 뒤 이 페이지로 되돌아온다.
  // 돌아왔을 때의 ?payment= 결과를 읽어 상태 메시지 + 권한 새로고침을 처리한다.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (payment === "success") {
        setStatus("결제가 확인되었습니다. 구매한 권한이 계정에 적용되었습니다.");
        onPaymentRecorded?.();
      } else if (payment === "closed") {
        setStatus("결제를 취소했습니다.");
      } else if (payment === "fail") {
        setStatus("결제가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      }

      params.delete("payment");
      params.delete("reason");
      params.delete("oid");
      const query = params.toString();
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}`,
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, [onPaymentRecorded]);

  const effectiveSelectedProductId = availableProducts.some(
    (product) => product.id === selectedProductId,
  )
    ? selectedProductId
    : fallbackProductId;
  const selectedProduct =
    availableProducts.find(
      (product) => product.id === effectiveSelectedProductId,
    ) ?? availableProducts[0];

  async function startPayment() {
    if (!selectedProduct) {
      return;
    }

    setIsPaying(true);
    setNeedsLogin(false);
    setStatus("결제 정보를 준비하는 중입니다.");

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setNeedsLogin(true);
        setStatus("결제 권한을 계정에 연결하려면 먼저 로그인해 주세요.");
        return;
      }

      const response = await fetch("/api/payments/inicis/prepare/", {
        body: JSON.stringify({
          buyerEmail,
          buyerName,
          productId: selectedProduct.id,
          redirectPath:
            typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const prepare = (await response.json().catch(() => ({
        reason: `server_${response.status}`,
      }))) as InicisPrepareResponse;

      if (!response.ok) {
        if (prepare.reason === "not_authenticated") {
          setNeedsLogin(true);
          setStatus("결제 권한을 계정에 연결하려면 먼저 로그인해 주세요.");
          return;
        }

        if (prepare.reason === "supabase_not_configured") {
          setStatus(
            "결제 서버 저장소가 아직 연결되지 않았습니다. 잠시 후 다시 시도해 주세요.",
          );
          return;
        }

        setStatus("결제 정보를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      if (!prepare.configured || !prepare.jsUrl || !prepare.form) {
        setStatus("결제 요청 정보가 완전하지 않습니다.");
        return;
      }

      setStatus("결제창으로 이동합니다. 완료 후 이 페이지로 돌아옵니다.");
      await loadInicisScript(prepare.jsUrl);
      submitInicisForm(prepare.form);
    } catch (error) {
      console.error(error);
      setStatus("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsPaying(false);
    }
  }

  // v1: 네이티브 앱에서는 엔타이틀먼트 상품을 팔지 않는다(이 패널은 이니시스 결제 흐름).
  // "웹에서 구매하세요" 같은 대체 안내를 넣으면 그 자체가 외부 결제 유도(안티-스티어링
  // 위반)이므로, 아무 문구 없이 섹션을 통째로 제거하는 것이 정답이다.
  if (isApp) {
    return null;
  }

  return (
    <section className="rounded-md border border-[#2b281f] bg-[#171511]/92 p-4">
      <div className="flex items-center gap-2">
        <CreditCard aria-hidden="true" className="text-[#f3d28a]" size={18} />
        <h2 className="text-lg font-semibold text-[#fffaf1]">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#b8aa95]">{description}</p>

      <div className="mt-4 grid gap-3">
        {availableProducts.map((product) => {
          const selected = product.id === effectiveSelectedProductId;

          return (
            <button
              className={`rounded-md border p-3 text-left transition ${
                selected
                  ? "border-[#f3d28a] bg-[#30271a] text-[#fffaf1]"
                  : "border-white/10 bg-[#0f0e0c]/72 text-[#d8cbb8] hover:border-[#f3d28a]/50"
              }`}
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-sm font-bold text-[#f3d28a]">
                  {product.amount.toLocaleString("ko-KR")}원
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
                {product.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.perks.map((perk) => (
                  <span
                    className="rounded-md bg-white/7 px-2 py-1 text-xs font-semibold text-[#b8aa95]"
                    key={perk}
                  >
                    {perk}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold text-[#d8cbb8]">
          이름
          <input
            className="h-11 rounded-md border border-white/10 bg-[#0f0e0c] px-3 text-[#fffaf1] outline-none placeholder:text-[#8f826f] focus:border-[#f3d28a]/70"
            onChange={(event) => setBuyerName(event.target.value)}
            placeholder="결제자 이름"
            value={buyerName}
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-[#d8cbb8]">
          이메일
          <input
            className="h-11 rounded-md border border-white/10 bg-[#0f0e0c] px-3 text-[#fffaf1] outline-none placeholder:text-[#8f826f] focus:border-[#f3d28a]/70"
            inputMode="email"
            onChange={(event) => setBuyerEmail(event.target.value)}
            placeholder="영수증/운영 확인용"
            value={buyerEmail}
          />
        </label>
      </div>

      <button
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#f3d28a] px-4 text-sm font-bold text-[#1a1712] transition hover:bg-[#ffdf98] disabled:cursor-not-allowed disabled:bg-[#4a412e] disabled:text-[#b8aa95]"
        disabled={isPaying}
        onClick={() => void startPayment()}
        type="button"
      >
        {isPaying ? (
          <Loader2 aria-hidden="true" className="animate-spin" size={16} />
        ) : (
          <CreditCard aria-hidden="true" size={16} />
        )}
        카드 결제 (KG이니시스)
      </button>

      {status ? (
        <p className="mt-3 rounded-md border border-white/10 bg-[#0f0e0c]/72 px-3 py-2 text-sm leading-6 text-[#b8aa95]">
          {status}
        </p>
      ) : null}
      {needsLogin ? (
        <Link
          className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md border border-[#c9a96a]/50 px-3 text-sm font-bold text-[#f3d28a] transition hover:bg-[#f3d28a]/10"
          href="/login"
        >
          로그인하고 결제하기
        </Link>
      ) : null}
    </section>
  );
}
