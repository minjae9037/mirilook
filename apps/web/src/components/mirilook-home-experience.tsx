import Image from "next/image";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { MirilookHomeStartButton } from "@/components/mirilook-home-start-button";
import { MirilookMainNav } from "@/components/mirilook-main-nav";

const FIT_BARS: Array<[string, number]> = [
  ["얼굴형 적합도", 95],
  ["분위기 매칭", 88],
  ["트렌드 반영", 91],
];

export function MirilookHomeExperience() {
  return (
    <main className="ml-home min-h-screen w-full">
      <header className="ml-home-header sticky top-0 z-20 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-5 py-5 sm:px-6">
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

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MirilookHomeStartButton />
            </div>
            <p className="ml-home-faint mt-4 text-[13px]">
              첫 상담 세트(9방향)는 무료 · 로그인 없이 바로 체험
            </p>
          </div>

          <div className="ml-home-card mx-auto w-full max-w-[440px] rounded-[26px] p-5">
            <div className="flex items-center gap-3">
              <div className="ml-home-field relative size-14 shrink-0 overflow-hidden rounded-[16px]">
                <Image
                  src="/mock/style-samples/optimized/women-bob-real-thumb-160.webp"
                  alt="추천 예시"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] font-extrabold">레이어드컷</span>
                  <span className="ml-home-chip rounded-full px-2 py-0.5 text-[11px] font-bold">
                    여성
                  </span>
                </div>
                <div className="mt-1.5 flex gap-1.5">
                  {["얼굴형", "트렌드"].map((c) => (
                    <span
                      key={c}
                      className="ml-home-good-chip inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                    >
                      <Check size={11} /> {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="ml-home-accent text-[26px] font-extrabold leading-none">
                  94
                </span>
                <p className="ml-home-faint text-[11px] font-bold">어울림</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {FIT_BARS.map(([label, value]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-[13px] font-bold">
                    <span className="ml-home-sub">{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="ml-home-meter mt-1.5 h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="ml-home-meter-fill h-full rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="ml-home-card-footer mt-5 flex items-center justify-between pt-4 text-[13px] font-bold">
              <span className="ml-home-sub">9방향 상담 이미지 · 미용실 상담용</span>
              <span className="ml-home-accent">잘 어울려요!</span>
            </div>
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
