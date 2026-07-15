"use client";

import { LogIn, LogOut, Store, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MirilookAdminNavButton } from "@/components/mirilook-admin-nav-button";
import { MirilookBrandLogo } from "@/components/mirilook-brand-logo";
import { MirilookLanguageSwitcher } from "@/components/mirilook-language-switcher";
import { MirilookThemeToggle } from "@/components/mirilook-theme-toggle";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

// 네비 순서(대표님 지정):
// 로그인 전) 미용실 > 커뮤니티 > 회원가입/로그인 > 스토어 > 다크/라이트 > COUNTRY
// 로그인 후) 미용실 > 커뮤니티 > 시작하기 > 마이페이지 > 로그아웃 > 스토어 > 다크/라이트 > COUNTRY
export function MirilookMainNav() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setIsSignedIn(Boolean(data.user));
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session?.user));
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    if (!supabase) {
      return;
    }

    await fetch("/api/admin-session/", { method: "DELETE" }).catch(() => null);
    await supabase.auth.signOut();
    setIsSignedIn(false);
  }

  const linkClass =
    "inline-flex shrink-0 items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-[#d8cbb8] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a]";
  const goldLinkClass =
    "inline-flex shrink-0 items-center gap-2 rounded-md border border-[#c9a96a]/45 px-3 py-2 text-sm font-semibold text-[#f3d28a] transition hover:bg-[#f3d28a]/10";

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      {/* 좌측: 브랜드 + 주요 링크(데스크톱). 링크를 미리룩 제목 바로 오른쪽에 둔다. */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 좌측 상단 브랜드 — 전 페이지 공통 컴포넌트로 크기/위치 고정. */}
        <MirilookBrandLogo />

        {/* 주요 목적지 링크는 모바일에서 하단 내비게이션으로 이동 — 데스크톱에서만 상단 노출 */}
        <div className="hidden flex-wrap items-center gap-2 sm:flex">
          <Link className={linkClass} href="/salons">
            미용실
          </Link>
          <Link className={linkClass} href="/community">
            커뮤니티
          </Link>

          {isSignedIn ? (
            <>
              <Link
                className="inline-flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 text-sm font-bold transition active:scale-95"
                href="/studio"
                style={{
                  background: "linear-gradient(135deg, #fb5c8d, #ea4a7c)",
                  color: "#ffffff",
                }}
              >
                시작하기
              </Link>
              <Link className={goldLinkClass} href="/mypage">
                <UserRound aria-hidden="true" size={15} />
                마이페이지
              </Link>
              <button className={linkClass} onClick={() => void signOut()} type="button">
                <LogOut aria-hidden="true" size={15} />
                로그아웃
              </button>
            </>
          ) : (
            <Link className={goldLinkClass} href="/login">
              <LogIn aria-hidden="true" size={15} />
              회원가입/로그인
            </Link>
          )}

          <Link
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[#f3d28a]/50 bg-[#f3d28a] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#ffdf98]"
            href="/store"
          >
            <Store aria-hidden="true" size={15} />
            스토어
          </Link>
        </div>
      </div>

      {/* 우측: 테마/언어/관리자 유틸 */}
      <div className="flex items-center gap-2">
        <MirilookThemeToggle />
        <MirilookLanguageSwitcher />
        <MirilookAdminNavButton />
      </div>
    </header>
  );
}
