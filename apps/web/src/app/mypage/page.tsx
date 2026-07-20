import { MirilookLogoutButton } from "@/components/mirilook-logout-button";
import { MirilookMainNav } from "@/components/mirilook-main-nav";
import { MirilookMyPageHub } from "@/components/mirilook-mypage-hub";
import { MirilookPageHero } from "@/components/mirilook-page-hero";

export const metadata = {
  title: "마이페이지",
};

export default function MyPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#11100e] text-[#f8f1e5]">
      <section className="mx-auto grid w-full min-w-0 max-w-3xl grid-cols-1 gap-6 px-5 py-5">
        <MirilookMainNav />

        <MirilookPageHero
          eyebrow="마이페이지"
          title="내 정보와 활동을 관리하세요."
          subtitle="카테고리를 선택해 프로필, 상담 기록, 알림, 보안, 계정을 각각 관리할 수 있습니다."
          action={<MirilookLogoutButton />}
        />

        <div className="min-w-0 pb-12">
          <MirilookMyPageHub />
        </div>
      </section>
    </main>
  );
}
