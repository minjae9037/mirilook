"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { AlertTriangle, Moon, Sun } from "lucide-react";
import { MirilookBrandLogo } from "@/components/mirilook-brand-logo";
import { MirilookStudio } from "@/components/mirilook-studio";
import {
  STUDIO_PROGRESS,
  stepFromPathname,
  stepHref,
  stepIndex,
  type StudioStep,
} from "@/lib/studio-flow";

// 스튜디오 위저드 레이아웃.
// - 스튜디오를 여기서 "지속 마운트" → 단계(URL)를 바꿔도 상태·생성이 유지된다.
// - 사진 이후 단계(index>=1)에서는 새로고침/이탈 시 확인 팝업(beforeunload) + 인페이지 안내.

type Theme = "light" | "dark";

// 공용 토글과 같은 "mirilook:theme-change" 이벤트를 공유(스토어 분리 버그 방지).
const THEME_EVENT = "mirilook:theme-change";
function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.mirilookTheme === "dark" ? "dark" : "light";
}
function setThemeGlobal(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.mirilookTheme = t;
  document.documentElement.style.colorScheme = t;
  try {
    window.localStorage.setItem("mirilook_theme", t);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: t }));
}
function subscribeTheme(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(THEME_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(THEME_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
function useMirilookTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => "light");
  const toggle = () => setThemeGlobal(theme === "dark" ? "light" : "dark");
  return [theme, toggle];
}

// 새로고침/탭닫기 확인창을 띄울 단계(사진 이후 = 입력·생성 데이터가 쌓인 상태).
function shouldGuardRefresh(step: StudioStep): boolean {
  return stepIndex(step) >= 1; // style ~ outfit
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [theme, toggleTheme] = useMirilookTheme();
  const dark = theme === "dark";
  const pathname = usePathname();
  const step = stepFromPathname(pathname);
  const guarded = shouldGuardRefresh(step);

  // 새로고침/이탈 가드: 브라우저 기본 확인창을 띄운다(문구는 브라우저가 고정 — 인페이지 안내로 보완).
  useEffect(() => {
    if (!guarded) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // 일부 브라우저는 returnValue가 설정돼야 확인창을 띄운다.
      event.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [guarded]);

  const pageBg = dark ? "#0f0e13" : "#F7F8FA";
  const ink = dark ? "#f4f5f7" : "#191f28";
  const chipBg = dark ? "#1b1922" : "#ffffff";
  const chipInk = dark ? "#b9b7c2" : "#4e5968";
  const chipBorder = dark ? "#2a2633" : "#E5E8EB";
  const activeIdx = stepIndex(step);

  return (
    <main className="min-h-screen w-full" style={{ background: pageBg, color: ink }}>
      <style>{`body > footer{display:none!important}`}</style>
      <div className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <MirilookBrandLogo />

          {/* 진행바 (입력 5단계) */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 sm:flex">
            {STUDIO_PROGRESS.map((s, i) => {
              const idx = stepIndex(s.key);
              const done = idx < activeIdx;
              const current = idx === activeIdx;
              return (
                <Link
                  key={s.key}
                  href={stepHref(s.key)}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold transition"
                  style={{
                    background: current
                      ? "linear-gradient(135deg, #fb5c8d, #ea4a7c)"
                      : done
                        ? dark
                          ? "rgba(251,92,141,0.16)"
                          : "#ffe4ee"
                        : "transparent",
                    color: current ? "#fff" : done ? "#ea4a7c" : chipInk,
                  }}
                >
                  <span
                    className="inline-flex size-4 items-center justify-center rounded-full text-[10px]"
                    style={{
                      background: current ? "rgba(255,255,255,0.28)" : "transparent",
                      border: current ? "none" : `1px solid ${chipBorder}`,
                    }}
                  >
                    {i + 1}
                  </span>
                  {s.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            title={dark ? "라이트 모드" : "다크 모드"}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full transition active:scale-90"
            style={{ background: chipBg, color: chipInk, border: `1px solid ${chipBorder}` }}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* 새로고침 시 데이터 소실 안내 (사진 이후 단계) */}
        {guarded ? (
          <div
            className="mb-4 flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold leading-5"
            style={{
              background: dark ? "rgba(251,92,141,0.12)" : "#FFF3F7",
              color: dark ? "#ff9ec4" : "#c2306a",
              border: `1px solid ${dark ? "rgba(251,92,141,0.3)" : "#F6D3E1"}`,
            }}
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>
              새로고침하거나 이 페이지를 벗어나면 지금까지 올린 사진과 입력·생성한 결과가 모두 사라집니다.
              계속 진행하려면 아래에서 이어서 작업해 주세요.
            </span>
          </div>
        ) : null}

        <MirilookStudio />
        {children}
      </div>
    </main>
  );
}
