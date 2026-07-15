import { MirilookHistoryManager } from "@/components/mirilook-history-manager";
import { MirilookMainNav } from "@/components/mirilook-main-nav";
import { MirilookPageHero } from "@/components/mirilook-page-hero";
import { MirilookProfilePanel } from "@/components/mirilook-profile-panel";

export const metadata = {
  title: "마이페이지",
};

export default function MyPage() {
  return (
    <main className="min-h-screen bg-[#11100e] text-[#f8f1e5]">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-5">
        <MirilookMainNav />

        <MirilookPageHero
          eyebrow="마이페이지"
          title="내 프로필과 기준 사진을 관리하세요."
          subtitle="닉네임, 자기소개, 추천용 얼굴 사진을 저장해두면 다음 상담부터 더 빠르게 스타일 추천을 시작할 수 있습니다."
        />

        <div className="grid gap-6 pb-12">
          <MirilookProfilePanel />
          <MirilookHistoryManager />
        </div>
      </section>
    </main>
  );
}
