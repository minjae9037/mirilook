import Link from "next/link";
import { AdminOperationsConsole } from "@/components/admin-operations-console";
import { MirilookLogoMark } from "@/components/mirilook-logo-mark";
import { loadAdminOperationsSummary } from "@/lib/server/admin-operations";

export const dynamic = "force-dynamic";

type ReadinessTone = "ready" | "partial" | "blocked" | "planned";

type ReadinessItem = {
  description: string;
  label: string;
  tone: ReadinessTone;
  value: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // 상담 히스토리 페이지네이션(?consultationPage=N)과, 페이지 이동 후에도
  // 보던 탭이 유지되도록 하는 ?tab=... 을 읽는다.
  const params = await searchParams;
  const consultationPage = parsePositiveInt(params.consultationPage) ?? 1;
  const paymentPage = parsePositiveInt(params.paymentPage) ?? 1;
  const initialTab = firstParam(params.tab);
  // 접근 제어는 미들웨어(proxy.ts)가 담당한다: 관리자 세션 쿠키 또는 Basic Auth가
  // 없으면 이 페이지에 도달하기 전에 401로 차단된다. (운영 환경 MIRILOOK_ADMIN_PASSWORD_SHA256)
  // 운영 홈/지표/서비스 연결/론칭 게이트는 운영 콘솔의 "운영 홈" 탭이 담당한다.
  const integrationItems = buildIntegrationItems();
  const operationsSummary = await loadAdminOperationsSummary({
    consultationPage,
    paymentPage,
  });

  return (
    <main className="min-h-screen bg-[#11100e] text-[#f8f1e5]">
      <div className="mx-auto grid w-full max-w-[88rem] gap-6 px-5 py-6">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end">
          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-3" href="/">
              <MirilookLogoMark className="size-10 shrink-0" decorative />
              <span>
                <span className="block text-sm font-bold tracking-[0.08em] text-[#fffaf1]">
                  Miri Look
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-[#8f826f]">
                  Admin · 운영 콘솔
                </span>
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="rounded-md border border-white/10 bg-[#171511]/92 px-3 py-2 text-sm font-semibold text-[#d8cbb8] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a]"
              href="/"
            >
              고객 사이트로
            </Link>
            <div className="rounded-md border border-[#2b281f] bg-[#171511]/92 px-4 py-2 text-sm text-[#d8cbb8]">
              Final provider:{" "}
              <span className="font-semibold text-[#f3d28a]">openai</span>
            </div>
          </div>
        </header>

        <AdminOperationsConsole
          initialTab={initialTab}
          integrationItems={integrationItems}
          summary={operationsSummary}
        />

        <p className="rounded-md border border-[#2b281f] bg-[#0f0e0c]/72 px-4 py-3 text-xs leading-5 text-[#b8aa95]">
          `minjae9037@naver.com` 계정 또는 Basic Auth로 접근한 운영자만 이 화면을
          사용할 수 있습니다.
        </p>
      </div>
    </main>
  );
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | string[] | undefined) {
  const raw = firstParam(value);
  const parsed = Number.parseInt(raw ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildIntegrationItems(): ReadinessItem[] {
  return [
    {
      description: "고객 화면에서 실제 AI 생성 API를 호출하는 공개 설정입니다.",
      label: "Live AI",
      tone:
        process.env.NEXT_PUBLIC_ENABLE_LIVE_AI === "true" ? "ready" : "blocked",
      value:
        process.env.NEXT_PUBLIC_ENABLE_LIVE_AI === "true" ? "활성" : "비활성",
    },
    {
      description: "추천 분석과 이미지 생성의 기본 provider 키입니다.",
      label: "OpenAI",
      tone: isConfigured("OPENAI_API_KEY") ? "ready" : "blocked",
      value: isConfigured("OPENAI_API_KEY") ? "연결" : "필요",
    },
    {
      description: "상담 결과, 이미지, 공유 링크를 저장할 전용 Supabase 프로젝트입니다.",
      label: "Supabase",
      tone:
        isConfigured("NEXT_PUBLIC_SUPABASE_URL") &&
        isConfigured("SUPABASE_SERVICE_ROLE_KEY")
          ? "ready"
          : "blocked",
      value:
        isConfigured("NEXT_PUBLIC_SUPABASE_URL") &&
        isConfigured("SUPABASE_SERVICE_ROLE_KEY")
          ? "연결"
          : "전용 프로젝트 필요",
    },
    {
      description:
        "상담 결과를 미용사 또는 고객 이메일로 보내는 발송 키와 검증 발신자 주소입니다.",
      label: "Resend",
      tone:
        isConfigured("RESEND_API_KEY") && isConfigured("RESEND_FROM_EMAIL")
          ? "ready"
          : isConfigured("RESEND_API_KEY")
            ? "partial"
            : "blocked",
      value:
        isConfigured("RESEND_API_KEY") && isConfigured("RESEND_FROM_EMAIL")
          ? "발송 준비"
          : isConfigured("RESEND_API_KEY")
            ? "발신자 주소 필요"
            : "필요",
    },
    {
      description: "장시간 이미지 생성, 재시도, 알림 작업을 비동기로 넘길 큐입니다.",
      label: "Trigger.dev",
      tone: isConfigured("TRIGGER_SECRET_KEY") ? "ready" : "planned",
      value: isConfigured("TRIGGER_SECRET_KEY") ? "키 연결" : "예정",
    },
    {
      description:
        "브라우저 Web Push 구독과 실제 발송에 필요한 VAPID 공개키/비공개키입니다.",
      label: "Web Push",
      tone:
        isConfigured("NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY") &&
        isConfigured("WEB_PUSH_PRIVATE_KEY")
          ? "ready"
          : "blocked",
      value:
        isConfigured("NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY") &&
        isConfigured("WEB_PUSH_PRIVATE_KEY")
          ? "발송 준비"
          : "VAPID 키 필요",
    },
    {
      description:
        "스타일 투표, 재생성, 프리미엄 상담 결제를 처리할 브라우저 키와 서버 검증/웹훅 키입니다.",
      label: "PortOne",
      tone:
        isConfigured("PORTONE_API_SECRET") &&
        isConfigured("NEXT_PUBLIC_PORTONE_STORE_ID") &&
        isConfigured("NEXT_PUBLIC_PORTONE_CHANNEL_KEY") &&
        isConfigured("PORTONE_WEBHOOK_SECRET")
          ? "ready"
          : isConfigured("PORTONE_API_SECRET") &&
              isConfigured("NEXT_PUBLIC_PORTONE_STORE_ID") &&
              isConfigured("NEXT_PUBLIC_PORTONE_CHANNEL_KEY")
            ? "partial"
            : "planned",
      value:
        isConfigured("PORTONE_API_SECRET") &&
        isConfigured("NEXT_PUBLIC_PORTONE_STORE_ID") &&
        isConfigured("NEXT_PUBLIC_PORTONE_CHANNEL_KEY") &&
        isConfigured("PORTONE_WEBHOOK_SECRET")
          ? "검증/웹훅 연결"
          : isConfigured("PORTONE_API_SECRET") &&
              isConfigured("NEXT_PUBLIC_PORTONE_STORE_ID") &&
              isConfigured("NEXT_PUBLIC_PORTONE_CHANNEL_KEY")
            ? "웹훅 시크릿 필요"
            : "예정",
    },
    {
      description:
        "관리자 화면 기본 인증입니다. production에서는 원문 비밀번호 또는 SHA-256 해시 미설정 시 관리자 화면을 닫습니다.",
      label: "Admin Basic Auth",
      tone: isAnyConfigured(
        "MIRILOOK_ADMIN_PASSWORD",
        "FITCUT_ADMIN_PASSWORD",
        "MIRILOOK_ADMIN_PASSWORD_SHA256",
        "FITCUT_ADMIN_PASSWORD_SHA256",
      )
        ? "ready"
        : "blocked",
      value: isAnyConfigured(
        "MIRILOOK_ADMIN_PASSWORD",
        "FITCUT_ADMIN_PASSWORD",
        "MIRILOOK_ADMIN_PASSWORD_SHA256",
        "FITCUT_ADMIN_PASSWORD_SHA256",
      )
        ? "보호"
        : "비밀번호 필요",
    },
  ];
}

function isConfigured(name: string) {
  return Boolean(process.env[name]?.replace(/^﻿/, "").trim());
}

function isAnyConfigured(...names: string[]) {
  return names.some((name) => isConfigured(name));
}
