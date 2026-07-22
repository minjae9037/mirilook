import Link from "next/link";
import { MirilookContactDialog } from "@/components/mirilook-contact-dialog";
import { MirilookMainNav } from "@/components/mirilook-main-nav";

// 푸터(mirilook-legal-footer.tsx)의 메뉴와 순서·명칭이 항상 같아야 한다.
// 한쪽에만 있는 항목이 생기면 이용자가 정책 페이지를 못 찾는다.
const legalLinks = [
  { href: "/company", label: "회사소개" },
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/refund", label: "취소·환불·교환" },
  { href: "/account-deletion", label: "계정·데이터 삭제" },
];

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#11100e] text-[#f8f1e5]">
      <div className="mx-auto max-w-6xl px-5 py-5">
        <MirilookMainNav />
      </div>
      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 pt-4 lg:grid-cols-[220px_1fr]">
        <aside className="ml-legal-card h-fit rounded-2xl p-3">
          <nav aria-label="정책 메뉴" className="grid gap-2">
            {legalLinks.map((item) => (
              <Link
                className="ml-legal-link rounded-lg px-3 py-2 text-sm font-semibold text-[#d8cbb8] transition"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <MirilookContactDialog className="ml-legal-link rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#d8cbb8] transition" />
          </nav>
        </aside>
        {/* 예전에는 data-mirilook-no-translate로 자동번역을 껐다(기계번역이 원문과
            달라지는 법적 리스크 때문). 그러나 외국어 이용자가 약관을 아예 읽지
            못하는 쪽이 더 큰 문제라 번역을 켰다. 대신 아래 고지로 "번역본은 참고용,
            효력은 한국어 원문" 임을 명시한다. 문장 단위 번역은 사전에 검수해 넣었다. */}
        <article className="ml-legal-card ml-legal-article rounded-2xl p-5 md:p-8">
          <p className="mb-5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-5 text-[#b8aa95]">
            본 문서의 번역본은 이해를 돕기 위한 참고용이며, 법적 효력은 한국어
            원문을 기준으로 합니다.
          </p>
          {children}
        </article>
      </section>
    </main>
  );
}
