"use client";

import { useSyncExternalStore } from "react";

// 앱은 capacitor.config.ts의 server.url로 mirilook.com을 그대로 로드한다(hybrid-remote).
// 이때 네이티브 브리지가 원격 페이지에 window.Capacitor를 주입하므로, apps/web이
// @capacitor/core를 의존성으로 갖지 않아도 전역으로 감지·호출할 수 있다.
// (import 방식은 패키지 미설치라 apps/web 빌드가 깨진다 — 반드시 전역을 쓸 것.)
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

// window.Capacitor는 앱 셸이 페이지 로드 시점에 주입하고 이후 바뀌지 않으므로 구독은 no-op.
// (모듈 상수로 둬야 useSyncExternalStore가 매 렌더 재구독하지 않는다.)
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * 서버 렌더 HTML은 항상 "웹 모드"다. useSyncExternalStore의 서버 스냅샷을 false로
 * 고정해 hydration mismatch 없이 첫 렌더를 웹 모드로 맞추고, 하이드레이션 직후
 * 실제 값으로 확정한다. 결제 버튼처럼 분기가 민감한 UI는 isReady가 true가 될
 * 때까지 실행을 막아야 앱에서 웹 결제 경로가 스치는 것을 원천 차단할 수 있다.
 */
export function useIsMirilookApp() {
  const isReady = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  return { isApp: isReady && isMirilookApp(), isReady };
}
