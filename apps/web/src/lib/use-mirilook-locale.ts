"use client";

import { useEffect, useState } from "react";
import {
  isMirilookLocale,
  mirilookLocaleStorageKey,
  type MirilookLocale,
} from "@/lib/mirilook-i18n";

/**
 * 현재 선택된 언어를 React 상태로 읽는다.
 *
 * 언어 전환은 평소 DOM 텍스트 치환(MirilookLanguageRuntime)으로 처리되지만,
 * 환율 환산처럼 **문구가 아니라 값 자체가 달라지는** 경우는 컴포넌트가 언어를
 * 알아야 한다.
 *
 * SSR HTML은 항상 "ko"로 렌더링되고 마운트 후에 실제 값으로 바뀐다.
 * (첫 렌더에서 localStorage를 읽으면 하이드레이션 불일치가 난다.)
 */
export function useMirilookLocale(): MirilookLocale {
  const [locale, setLocale] = useState<MirilookLocale>("ko");

  useEffect(() => {
    const stored = window.localStorage.getItem(mirilookLocaleStorageKey);

    if (isMirilookLocale(stored)) {
      setLocale(stored);
    }

    function handleLocaleChange(event: Event) {
      const next = (event as CustomEvent<MirilookLocale>).detail;

      if (isMirilookLocale(next)) {
        setLocale(next);
      }
    }

    window.addEventListener("mirilook:locale-change", handleLocaleChange);

    return () => {
      window.removeEventListener("mirilook:locale-change", handleLocaleChange);
    };
  }, []);

  return locale;
}
