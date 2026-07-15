import { MirilookHairMoneyStore } from "@/components/mirilook-hair-money-store";
import { MirilookMainNav } from "@/components/mirilook-main-nav";
import { MirilookPageHero } from "@/components/mirilook-page-hero";

export const metadata = {
  title: "Hair Money Store | Miri Look",
};

export default function StorePage() {
  return (
    <main className="min-h-screen bg-[#11100e] text-[#f8f1e5]">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-5">
        <MirilookMainNav />

        <MirilookPageHero
          eyebrow="Hair Money"
          title="Hair Money로 원하는 스타일을 더 정확하게 확인하세요"
          subtitle="Hair Money는 미리룩의 헤어 추천과 이미지 생성 기능을 사용하는 유상 포인트입니다. 카드 결제 검증이 완료되면 회원 계정에 적립되고, 추천 요청 시 사용량이 자동 차감되어 내역으로 기록됩니다."
        />

        <div className="pb-12">
          <MirilookHairMoneyStore />
        </div>
      </section>
    </main>
  );
}
