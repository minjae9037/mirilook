"use client";

import {
  Home,
  Scissors,
  Sparkles,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type TabIcon = typeof Home;

type BottomTab = {
  key: string;
  label: string;
  href: string;
  icon: TabIcon;
  isActive: (pathname: string) => boolean;
};

// 하단 내비게이션(모바일 전용). 하트스코어처럼 주요 목적지를 아이콘 탭으로 고정한다.
const STATIC_TABS: BottomTab[] = [
  {
    key: "home",
    label: "홈",
    href: "/",
    icon: Home,
    isActive: (path) => path === "/",
  },
  {
    key: "studio",
    label: "AI추천",
    href: "/studio",
    icon: Sparkles,
    isActive: (path) => path.startsWith("/studio"),
  },
  {
    key: "salons",
    label: "미용실",
    href: "/salons",
    icon: Scissors,
    isActive: (path) => path.startsWith("/salons"),
  },
  {
    key: "community",
    label: "커뮤니티",
    href: "/community",
    icon: Users,
    isActive: (path) => path.startsWith("/community"),
  },
  {
    key: "store",
    label: "스토어",
    href: "/store",
    icon: Store,
    isActive: (path) => path.startsWith("/store"),
  },
];

export function MirilookBottomNav() {
  const pathname = usePathname() ?? "/";
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

  const myTab: BottomTab = {
    key: "my",
    label: "마이",
    href: isSignedIn ? "/mypage" : "/login",
    icon: UserRound,
    isActive: (path) =>
      path.startsWith("/mypage") ||
      path.startsWith("/login") ||
      path.startsWith("/history"),
  };

  const tabs = [...STATIC_TABS, myTab];

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur sm:hidden"
      style={{
        background: "var(--ml-card, #ffffff)",
        borderColor: "var(--ml-border, rgba(25, 31, 40, 0.12))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((tab) => {
          const active = tab.isActive(pathname);
          const Icon = tab.icon;
          return (
            <li className="flex-1" key={tab.key}>
              <Link
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center justify-center gap-1 px-0.5 py-2 text-[10px] font-semibold transition"
                href={tab.href}
                style={{
                  color: active
                    ? "var(--ml-gold, #ea4a7c)"
                    : "var(--ml-muted, #5f6b7a)",
                }}
              >
                <Icon
                  aria-hidden="true"
                  size={22}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span className="whitespace-nowrap leading-none">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
