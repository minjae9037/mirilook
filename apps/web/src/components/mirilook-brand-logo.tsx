import Image from "next/image";
import Link from "next/link";

// 전 페이지 공통 브랜드 로고(핑크 아이콘 + "미리룩"). 페이지마다 크기가 달라지지
// 않도록 아이콘/텍스트 크기를 한 곳에서 고정한다. 라이트/다크 어느 테마에서도
// 아이콘은 자체 흰 배경 배지 위라 동일하게 보인다.
export function MirilookBrandLogo() {
  return (
    <Link
      aria-label="미리룩 홈으로"
      className="flex w-fit shrink-0 items-center gap-2.5 transition hover:opacity-85"
      href="/"
    >
      <span className="relative flex size-11 shrink-0 overflow-hidden rounded-[14px] border border-[#ffd5e3] bg-[#fff5f8] shadow-sm sm:size-12">
        <Image
          alt="미리룩 아이콘"
          className="scale-[1.22] object-cover"
          fill
          priority
          sizes="48px"
          src="/brand/mirilook-main-theme-pink-white-bg.png"
        />
      </span>
      <span
        className="whitespace-nowrap text-[23px] font-extrabold tracking-tight sm:text-[26px]"
        style={{ color: "#ea4a7c" }}
      >
        미리룩
      </span>
    </Link>
  );
}
