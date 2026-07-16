"use client";

import { isMirilookApp } from "@/lib/mirilook-native";
import {
  MirilookHairMoneyProducts,
  toNativeProductId,
} from "@/lib/mirilook-payments";

/** 웹 상품 목록에서 파생한 네이티브 상품 id 6종 — Play Console에 만들 목록의 단일 원천. */
export const NATIVE_HAIR_MONEY_PRODUCT_IDS = MirilookHairMoneyProducts.map(
  (product) => toNativeProductId(product.id),
);

const REVENUECAT_ANDROID_KEY = (
  process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY ?? ""
).trim();

export type NativeStoreProduct = {
  currencyCode?: string;
  identifier: string;
  price?: number;
  priceString?: string;
  title?: string;
  [key: string]: unknown;
};

type PurchasesBridge = {
  configure(options: { apiKey: string; appUserID?: string | null }): Promise<void>;
  getProducts(options: {
    productIdentifiers: string[];
    type?: string;
  }): Promise<{ products: NativeStoreProduct[] }>;
  logIn(options: { appUserID: string }): Promise<unknown>;
  purchaseStoreProduct(options: { product: NativeStoreProduct }): Promise<{
    productIdentifier: string;
    transaction?: { transactionIdentifier?: string };
  }>;
  restorePurchases(): Promise<unknown>;
};

// 플러그인 등록명 "Purchases" — @revenuecat/purchases-capacitor의 registerPlugin 이름.
function getPurchasesBridge(): PurchasesBridge | null {
  if (!isMirilookApp()) {
    return null;
  }

  return (window.Capacitor?.Plugins?.Purchases as PurchasesBridge | undefined) ?? null;
}

/** 앱 안에서 구글 인앱결제를 실제로 실행할 수 있는 상태인지(브리지 + 공개키). */
export function isNativeBillingAvailable() {
  return Boolean(getPurchasesBridge()) && Boolean(REVENUECAT_ANDROID_KEY);
}

let configuredForProfile: string | null = null;

/** 로그인된 Supabase profile id로 RevenueCat 초기화(중복 호출 안전). */
export async function ensureNativeBillingReady(profileId: string) {
  const purchases = getPurchasesBridge();

  if (!purchases) {
    throw new Error("native_billing_unavailable");
  }

  if (!REVENUECAT_ANDROID_KEY) {
    throw new Error("native_billing_not_configured");
  }

  if (configuredForProfile === null) {
    await purchases.configure({
      apiKey: REVENUECAT_ANDROID_KEY,
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

/** 스토어 상품(현지화 가격 포함) 조회 — UI에는 priceString을 그대로 표시한다. */
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
 * 사용자가 결제 시트를 닫으면 "purchase_cancelled"를 throw한다.
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

  // 즉시 적립 경로. 이 요청이 실패해도 RevenueCat 웹훅이 같은 엔드포인트로 보정한다.
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
    balance?: number | null;
    reason?: string;
  } | null;

  return {
    applied: grant?.applied ?? false,
    balance: grant?.balance ?? null,
    reason: grant?.reason,
    transactionId,
  };
}

/** 소모성 상품이라 통상 불필요하지만 고객문의 대응용으로 남겨둔다. */
export async function restoreNativePurchases() {
  const purchases = getPurchasesBridge();

  if (!purchases) {
    throw new Error("native_billing_unavailable");
  }

  return purchases.restorePurchases();
}
