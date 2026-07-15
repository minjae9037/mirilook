import type { ReactNode } from "react";

// 사이트 전 페이지 공통 히어로(에이브로우 + 제목 + 부제). 하트스코어처럼
// 핑크 알약 에이브로우 + extrabold 제목 + muted 부제로 헤딩 스케일을 통일한다.
// 색은 라이트/다크 모두에서 동작하도록: 제목/부제는 리맵되는 hex 유틸을,
// 핑크 에이브로우는 테마 무관한 반투명 핑크 인라인 스타일을 쓴다.
export function MirilookPageHero({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        {eyebrow ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold"
            style={{ background: "rgba(234, 74, 124, 0.12)", color: "#ea4a7c" }}
          >
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#fffaf1] sm:text-[34px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-[15px] leading-7 text-[#b8aa95]">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
