"use client";

import { LogIn, Sparkles } from "lucide-react";
import Link from "next/link";

// 미로그인 방문자가 /studio/photos로 들어왔을 때의 맛보기.
// 실제 스튜디오를 블러로 깔아 "뒤에 뭔가 있다"는 건 보이되 읽을 수는 없게 하고,
// 그 위에 가입 CTA를 얹는다. (하트스코어 /discover와 같은 방식)
//
// pointerEvents:none — 블러 뒤 UI를 실제로 누르거나 사진을 올릴 수 없어야 한다.
// userSelect:none·aria-hidden — 드래그 선택이나 스크린리더로 내용이 새는 것도 막는다.
export function MirilookStudioTeaser({
  children,
  dark,
  pageBg,
}: {
  children: React.ReactNode;
  dark: boolean;
  pageBg: string;
}) {
  return (
    <div className="relative">
      {/* 스튜디오는 세로로 긴 화면이라, 잘라내지 않으면 아래 CTA가 한참 스크롤해야
          보이는 자리로 밀린다. 맛보기는 "뭔가 있다"만 보이면 되므로 잘라서 쓴다.
          높이는 화면에 맞춰 늘리되(빈 공간 방지) 헤더(~85px)와 하단 내비(~57px) 자리를
          빼서 CTA가 내비에 가리지 않게 한다. dvh — 모바일 주소창 높이 변동 대응. */}
      <div className="overflow-hidden" style={{ maxHeight: "calc(100dvh - 170px)" }}>
        <div
          aria-hidden="true"
          style={{
            filter: "blur(7px)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {children}
        </div>
      </div>

      {/* 아래로 갈수록 배경색으로 녹여 CTA가 뜨는 자리를 비운다. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: `linear-gradient(180deg, transparent, ${pageBg} 72%)` }}
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-5 pb-4">
        <p
          className="text-center text-[15px] font-bold leading-6"
          style={{ color: dark ? "#f4f5f7" : "#191f28" }}
        >
          가입하면 내 얼굴에 어울리는
          <br />
          스타일 9개를 바로 받아볼 수 있어요
        </p>

        {/* ⚠️ 앵커는 globals.css의 `a { color: inherit }` / `font: inherit`(레이어 밖)이
            Tailwind 글자 유틸리티를 이기므로, 글자 스타일은 인라인으로만 준다. */}
        <Link
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl px-4 py-3.5 transition"
          href="/login?mode=signup"
          style={{
            background: "linear-gradient(135deg, #fb5c8d, #ea4a7c)",
            color: "#fff",
            fontSize: "15px",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <Sparkles aria-hidden="true" size={17} />
          회원가입하고 시작하기
        </Link>

        <Link
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-xl border px-4 py-3.5 transition"
          href="/login"
          style={{
            background: dark ? "#1b1922" : "#ffffff",
            borderColor: dark ? "#2a2633" : "#E5E8EB",
            color: dark ? "#b9b7c2" : "#4e5968",
            fontSize: "14px",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <LogIn aria-hidden="true" size={16} />
          이미 회원이에요 · 로그인
        </Link>
      </div>
    </div>
  );
}
