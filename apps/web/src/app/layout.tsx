import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MirilookBottomNav } from "@/components/mirilook-bottom-nav";
import { MirilookLegalFooter } from "@/components/mirilook-legal-footer";
import { MirilookLanguageRuntime } from "@/components/mirilook-language-runtime";
import { MirilookMobileAppPrompt } from "@/components/mirilook-mobile-app-prompt";
import "./globals.css";

const siteUrl = "https://mirilook.com";
const siteTitle = "Miri Look | AI 헤어스타일 추천";
const siteDescription =
  "내 얼굴 사진을 바탕으로 어울리는 헤어컷과 컬러를 추천하고, 미용사 상담용 이미지를 생성합니다.";
const ADSENSE_CLIENT = "ca-pub-8033046631376018";
const THEME_BOOT_SCRIPT = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("mirilook_theme");
    const theme = storedTheme === "dark" ? "dark" : "light";
    document.documentElement.dataset.mirilookTheme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.mirilookTheme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;
const CANONICAL_HOST_BOOT_SCRIPT = `
(() => {
  try {
    const host = window.location.hostname.toLowerCase();
    const shouldRedirect =
      host === "www.mirilook.com" ||
      host === "fitcut-mirror.vercel.app" ||
      host === "mirilook-mj-insight-s-projects.vercel.app" ||
      host === "mirilook-minjae9037-mj-insight-s-projects.vercel.app";

    if (!shouldRedirect) {
      return;
    }

    window.location.replace(
      "https://mirilook.com" +
        window.location.pathname +
        window.location.search +
        window.location.hash,
    );
  } catch {
    /* noop */
  }
})();
`;

// 사이트 전역 구조화 데이터(Organization + WebSite) — 브랜드 엔티티·검색 이해도 강화.
const SITE_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: "미리룩",
      alternateName: ["Miri Look", "mirilook"],
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      description: siteDescription,
      parentOrganization: { "@type": "Organization", name: "엠제이인사이트 주식회사" },
      address: { "@type": "PostalAddress", addressLocality: "부천시 소사구", addressRegion: "경기도", addressCountry: "KR" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "미리룩",
      alternateName: "Miri Look",
      url: siteUrl,
      description: siteDescription,
      inLanguage: "ko-KR",
      publisher: { "@id": `${siteUrl}/#org` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.webmanifest",
  applicationName: "Miri Look",
  other: {
    "google-adsense-account": ADSENSE_CLIENT, // 애드센스 사이트 소유 확인용 메타태그
  },
  title: {
    default: siteTitle,
    template: "%s | Miri Look",
  },
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  appleWebApp: {
    capable: true,
    title: "Miri Look",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/brand/mirilook-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/mirilook-icon-1024.png", sizes: "1024x1024", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "Miri Look",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/brand/mirilook-og.png?v=2",
        width: 1200,
        height: 630,
        alt: "Miri Look AI 헤어스타일 추천 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/brand/mirilook-og.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full overflow-x-clip antialiased"
      data-mirilook-theme="light"
    >
      {/* 하단 여백은 하단 내비 높이만큼 — 표시 조건과 반드시 같은 기준이어야 한다.
          globals.css의 .ml-app-body 참조(포인터 기반). */}
      <body className="ml-app-body min-h-full ml-pink">
        {/* 하트스코어와 동일한 Pretendard Variable(dynamic-subset)을 런타임 로드.
            React가 stylesheet link를 <head>로 호이스트한다. Tailwind v4 빌드가 CSS
            @import를 인라인하다 실패해 폰트가 안 뜨던 문제 우회. */}
        <link
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net"
          rel="preconnect"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: CANONICAL_HOST_BOOT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_LD) }}
        />
        <script
          async
          crossOrigin="anonymous"
          id="google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        />
        {children}
        <MirilookLanguageRuntime />
        <MirilookLegalFooter />
        <MirilookBottomNav />
        <MirilookMobileAppPrompt />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
