import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "계정 및 데이터 삭제",
  description: "미리룩 계정과 데이터를 삭제하는 방법을 안내합니다.",
};

// Google Play 데이터 보안의 "계정 URL 삭제"로 제출하는 공개 페이지.
// 구글이 요구하는 3가지를 이 페이지 하나로 충족해야 한다:
//   1) 스토어 등록정보에 표시되는 앱/개발자 이름 기재
//   2) 계정 삭제를 요청하기 위해 취해야 할 단계를 눈에 띄게 표시
//   3) 삭제되거나 보관되는 데이터 유형 및 추가 보관 기간을 지정
// ⚠️ 로그인 없이 열려야 한다. /mypage는 로그인해야 보이므로 이 URL을 대신 제출한다.
export default function AccountDeletionPage() {
  return (
    <div className="space-y-8 text-sm leading-7 text-[#d8cbb8]">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f3d28a]">
          Account &amp; Data Deletion
        </p>
        <h1 className="mt-3 text-[26px] font-extrabold tracking-[-0.02em] text-[#fffaf1] sm:text-[32px]">
          계정 및 데이터 삭제
        </h1>
        <p className="mt-3">
          앱 이름: <b className="text-[#fffaf1]">미리룩 (Miri Look)</b> · 개발자:{" "}
          <b className="text-[#fffaf1]">엠제이인사이트 주식회사</b>
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">계정을 삭제하는 방법</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            미리룩 앱 또는{" "}
            <Link className="font-semibold text-[#f3d28a] underline" href="/login">
              mirilook.com
            </Link>
            에 로그인합니다.
          </li>
          <li>
            <Link className="font-semibold text-[#f3d28a] underline" href="/mypage">
              마이페이지
            </Link>
            로 이동합니다. (앱에서는 하단 내비게이션의 “마이”)
          </li>
          <li>
            페이지 맨 아래 <b className="text-[#fffaf1]">“계정 삭제”</b> 항목에서{" "}
            <b className="text-[#fffaf1]">“계정 삭제하기”</b>를 누릅니다.
          </li>
          <li>
            확인을 위해 계정 이메일을 입력한 뒤{" "}
            <b className="text-[#fffaf1]">“영구 삭제”</b>를 누릅니다.
          </li>
        </ol>
        <p>
          삭제는 <b className="text-[#fffaf1]">즉시 처리</b>되며 되돌릴 수 없습니다. 직접
          삭제가 어려운 경우 jipsa.admin@gmail.com으로 요청하시면 접수 후 30일 이내에
          처리합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">삭제되는 데이터</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>계정 정보(이메일, 소셜 로그인 식별값, 닉네임, 자기소개, 프로필 사진)</li>
          <li>
            <b className="text-[#fffaf1]">업로드한 얼굴 사진 원본</b>
          </li>
          <li>AI가 생성한 헤어스타일 추천 결과와 9방향 상담 이미지</li>
          <li>상담 공유 링크 및 그 접근 권한</li>
          <li>보유한 Hair Money 잔액(환불되지 않고 소멸)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">삭제되지 않고 남는 데이터</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b className="text-[#fffaf1]">커뮤니티 게시글·댓글</b> — 작성자 식별정보가 제거된
            익명 상태로 남습니다. 다른 이용자의 대화 맥락이 훼손되지 않도록 하기 위함이며,
            해당 게시물의 삭제를 원하시면 계정 삭제 전에 직접 삭제하시거나
            jipsa.admin@gmail.com으로 요청해 주세요.
          </li>
          <li>
            <b className="text-[#fffaf1]">결제·환불 기록</b> — 전자상거래 등에서의 소비자보호에
            관한 법률에 따라 <b className="text-[#fffaf1]">5년간</b> 보관됩니다.
          </li>
          <li>
            <b className="text-[#fffaf1]">부정 이용 방지 기록</b> — 신고·제재 이력은 재가입을
            통한 회피를 막기 위해 필요한 범위에서 최소한으로 보관될 수 있습니다.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">
          계정을 삭제하지 않고 데이터만 지우려면
        </h2>
        <p>
          계정을 유지한 채 일부 데이터만 삭제할 수 있습니다.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>마이페이지 → 기준 사진에서 업로드한 얼굴 사진을 개별 삭제</li>
          <li>마이페이지 → 상담 기록에서 상담 결과와 생성 이미지를 개별 삭제</li>
          <li>커뮤니티에서 본인이 작성한 게시글·댓글 삭제</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#fffaf1]">문의</h2>
        <p>
          계정·데이터 삭제 관련 문의는 jipsa.admin@gmail.com으로 접수해 주세요. 자세한 처리
          기준은{" "}
          <Link className="font-semibold text-[#f3d28a] underline" href="/privacy">
            개인정보처리방침
          </Link>
          에서 확인하실 수 있습니다.
        </p>
      </section>
    </div>
  );
}
