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
import { useMirilookSession } from "@/lib/mirilook-session";

type TabIcon = typeof Sparkles;

type BottomTab = {
  key: string;
  label: string;
  href: string;
  icon: TabIcon;
  isActive: (pathname: string) => boolean;
  // 상시 강조(선택된 것처럼 항상 핑크로 노출)
  pinned?: boolean;
};

// 미로그인 방문자를 보내는 맛보기 화면. 스튜디오가 블러로 깔리고 가입 CTA가 뜬다.
const TEASER_HREF = "/studio/gender";

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
    pinned: true,
  },
];

export function MirilookBottomNav() {
  const pathname = usePathname() ?? "/";
  const session = useMirilookSession();

  // 세션을 확인하기 전에는 그리지 않는다. 자리(높이)는 .ml-app-body가 이미
  // 비워두고 있어서 나중에 나타나도 본문이 밀리지 않는다.
  if (session === "unknown") {
    return null;
  }

  if (session === "gated") {
    return <GatedBottomNav isOnTeaser={pathname.startsWith(TEASER_HREF)} />;
  }

  const myTab: BottomTab = {
    key: "my",
    label: "마이",
    href: session === "demo" ? "/login" : "/mypage",
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
      className="ml-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur"
      style={{
        background: "var(--ml-card, #ffffff)",
        borderColor: "var(--ml-border, rgba(25, 31, 40, 0.12))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((tab) => {
          const active = tab.isActive(pathname);
          const highlighted = active || Boolean(tab.pinned);
          const Icon = tab.icon;
          return (
            <li className="flex-1" key={tab.key}>
              <Link
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center justify-center gap-1 px-0.5 py-2 text-[10px] font-semibold transition"
                href={tab.href}
                style={{
                  color: highlighted
                    ? "var(--ml-gold, #ea4a7c)"
                    : "var(--ml-muted, #5f6b7a)",
                }}
              >
                <Icon
                  aria-hidden="true"
                  size={22}
                  strokeWidth={highlighted ? 2.4 : 2}
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

// 미로그인 상태의 하단 바. 탭을 전부 감추고 둘러보기 + 회원가입 유도만 남긴다.
// 높이를 전체 탭(약 53px)과 비슷하게 맞춰야 .ml-app-body가 비워둔 자리와 어긋나지 않는다.
//
// ⚠️ 글자 색·굵기·크기를 className으로 주면 안 된다. globals.css의
//    `a { color: inherit }` / `button, a, textarea, input { font: inherit }`가
//    레이어 밖 규칙이라, @layer utilities에 있는 text-white·font-bold·text-[14px]를
//    특정도와 무관하게 이긴다. 앵커는 인라인 style로만 글자를 지정할 수 있다.
//
// 글자 크기는 clamp로 화면 폭에 맞춰 줄인다 — "회원가입하고 시작하기"가 좁은 기기에서
// 두 줄로 접히지 않게. nowrap이 최후의 방어선.
function GatedBottomNav({ isOnTeaser }: { isOnTeaser: boolean }) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="ml-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur"
      style={{
        background: "var(--ml-card, #ffffff)",
        borderColor: "var(--ml-border, rgba(25, 31, 40, 0.12))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-md items-center gap-2 px-3 py-1.5">
        <Link
          aria-current={isOnTeaser ? "page" : undefined}
          className="flex flex-none items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 transition"
          href={TEASER_HREF}
          style={{
            borderColor: isOnTeaser
              ? "var(--ml-gold, #ea4a7c)"
              : "var(--ml-border, rgba(25, 31, 40, 0.12))",
            color: isOnTeaser
              ? "var(--ml-gold, #ea4a7c)"
              : "var(--ml-muted, #5f6b7a)",
            fontSize: "clamp(12px, 3.4vw, 13px)",
            fontWeight: 700,
            // 글자만 줄어들고 누를 수 있는 크기는 유지되게(터치 최소 44px).
            minHeight: "44px",
            whiteSpace: "nowrap",
          }}
        >
          <Sparkles
            aria-hidden="true"
            size={15}
            strokeWidth={isOnTeaser ? 2.4 : 2}
          />
          둘러보기
        </Link>
        <Link
          className="flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 transition"
          href="/login?mode=signup"
          style={{
            background: "var(--ml-gold, #ea4a7c)",
            color: "#fff",
            fontSize: "clamp(12px, 3.6vw, 14px)",
            fontWeight: 700,
            minHeight: "44px",
            whiteSpace: "nowrap",
          }}
        >
          회원가입하고 시작하기
        </Link>
      </div>
    </nav>
  );
}
