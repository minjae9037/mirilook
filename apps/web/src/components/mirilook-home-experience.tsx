import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MirilookHomeStartButton } from "@/components/mirilook-home-start-button";
import { MirilookMainNav } from "@/components/mirilook-main-nav";

export function MirilookHomeExperience() {
  return (
    <main className="ml-home min-h-screen w-full">
      <header className="ml-home-header sticky top-0 z-20 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-6">
          <MirilookMainNav />
        </div>
      </header>

      <section className="ml-home-hero w-full">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <div>
            <span className="ml-home-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold">
              <Sparkles size={14} aria-hidden="true" /> AI 헤어 추천
            </span>
            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.22] tracking-[-0.02em] sm:text-[46px] lg:text-[54px]">
              내 얼굴에 어울리는
              <br />
              <span className="ml-home-accent">헤어</span>, 미리 봐요
            </h1>
            <p className="ml-home-sub mt-5 max-w-xl text-[16px] leading-8 sm:text-[18px]">
              사진 3장이면 충분해요. AI가 어울리는 스타일 9개를 골라주고,
              9방향 상담 이미지까지 만들어 미용실 상담에 그대로 써요.
            </p>

            {/* "첫 상담 세트는 무료 · 로그인 없이 바로 체험" 문구 삭제(2026-07-17).
                둘 다 사실이 아니었다 — 시작 버튼은 미로그인 시 /login으로 보내고,
                신규 계정 잔액은 0 HM인데 추천 1회에 4 HM이 필요하다. 무료 체험은 제공하지 않는다. */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MirilookHomeStartButton />
            </div>
          </div>

          {/* 우측: 앱 시연 영상(릴스) — 폰 목업 안에서 자동재생·무음·반복.
              영상은 미리룩 실제 화면 흐름(로그인→사진3장→9장 추천→선택→9방향 상담)을
              AI 생성 이미지로만 재현. 실제 고객/개인 사진은 사용하지 않는다. */}
          <div className="ml-home-card mx-auto w-full max-w-[288px] rounded-[44px] p-2.5">
            <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[36px] bg-black/[0.04]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/reel/mirilook-demo.mp4?v=4"
                poster="/reel/mirilook-demo-poster.jpg?v=4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="미리룩 앱 시연 영상 — AI 헤어스타일 추천 흐름"
              />
            </div>
            <p className="ml-home-faint mb-1 mt-3 text-center text-[11.5px] font-semibold">
              앱 시연 예시 · AI 생성 이미지
            </p>
          </div>
        </div>
      </section>

      <section className="ml-home-stat-section">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-3 px-4 py-8 sm:px-6">
          {[
            ["9개", "스타일 추천"],
            ["9방향", "상담 이미지"],
            ["AI", "얼굴형 분석"],
          ].map(([big, small], i) => (
            <div key={big} className={`flex flex-col items-center gap-1 ${i < 2 ? "ml-home-stat-split" : ""}`}>
              <span className="ml-home-accent text-[24px] font-extrabold sm:text-[28px]">
                {big}
              </span>
              <span className="ml-home-faint text-[13px] font-medium">{small}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="ml-home-bottom-cta overflow-hidden rounded-[28px] px-6 py-12 text-center sm:px-10 sm:py-16">
          <p className="text-[24px] font-extrabold sm:text-[30px]">지금 내 스타일 찾아보기</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-6">
            사진 3장만 올리면, 몇 분 안에 9방향 상담 이미지까지 완성돼요.
          </p>
          <MirilookHomeStartButton variant="secondary" />
        </div>
        <p className="ml-home-faint mt-8 text-center text-[12px] leading-5">
          미리룩의 AI 추천 이미지는 상담 참고용이며 실제 시술 결과와 다를 수 있어요. ·{" "}
          <Link href="/company" className="ml-home-sub font-bold">
            회사·문의
          </Link>
        </p>
      </section>
    </main>
  );
}
