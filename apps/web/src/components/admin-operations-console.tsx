"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle2,
  Coins,
  CreditCard,
  Database,
  Eye,
  ImageIcon,
  LayoutDashboard,
  LifeBuoy,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCcw,
  Scissors,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Users,
  Vote,
  X,
  type LucideIcon,
} from "lucide-react";
import { AdminResearchTrendForm } from "@/components/admin-research-trend-form";
import { AdminStatusActions } from "@/components/admin-status-actions";
import type {
  AdminOperationCategory,
  AdminOperationImage,
  AdminOperationItemDetail,
  AdminOperationMetric,
  AdminOperationSection,
  AdminOperationsSummary,
} from "@/lib/server/admin-operations";

type IntegrationItem = {
  description: string;
  label: string;
  tone: "blocked" | "partial" | "planned" | "ready";
  value: string;
};

type AdminTab = {
  description: string;
  icon: LucideIcon;
  id: AdminOperationCategory;
  metricLabels: string[];
  title: string;
};

type AdminNotificationResult = {
  accepted?: boolean;
  reason?: string;
  triggered?: boolean;
};

const tabs: AdminTab[] = [
  {
    description: "운영 콘솔 개요, 핵심 지표, 서비스 연결과 론칭 준비 상태를 봅니다.",
    icon: LayoutDashboard,
    id: "home",
    metricLabels: [],
    title: "운영 홈",
  },
  {
    description: "가입 회원 목록과 계정 상태를 확인합니다.",
    icon: Users,
    id: "customers",
    metricLabels: ["회원"],
    title: "고객 관리",
  },
  {
    description: "생성 실패, 환불 요청, 결제 오류, 일반 문의를 처리합니다.",
    icon: LifeBuoy,
    id: "support",
    metricLabels: ["고객지원"],
    title: "문의 관리",
  },
  {
    description: "입점 신청, 예약 문의, 리뷰 승인과 파트너 공개 상태를 관리합니다.",
    icon: Scissors,
    id: "salons",
    metricLabels: ["입점 신청", "예약 문의", "리뷰"],
    title: "미용실 관리",
  },
  {
    description: "고객이 저장한 상담 결과와 원본/추천/상담 이미지를 확인합니다.",
    icon: ImageIcon,
    id: "consultations",
    metricLabels: ["상담 세션"],
    title: "최근 상담 히스토리",
  },
  {
    description: "H머니 충전, 추천 차감, 환불, 운영 조정 원장을 추적합니다.",
    icon: Coins,
    id: "hair_money",
    metricLabels: ["H머니 원장"],
    title: "최근 H머니 원장",
  },
  {
    description: "상담 보드 공유 링크와 이메일 발송 기록을 관리합니다.",
    icon: Share2,
    id: "shares",
    metricLabels: ["공유 링크", "이메일 공유"],
    title: "최근 공유 링크",
  },
  {
    description: "사진 피드, 투표, 댓글, DM, 신고와 숨김 처리를 운영합니다.",
    icon: MessageSquare,
    id: "community",
    metricLabels: ["사진 피드", "투표 글", "댓글 / DM", "신고/삭제"],
    title: "커뮤니티 관리",
  },
  {
    description: "PortOne/이니시스 결제 이벤트와 유료 권한을 확인합니다.",
    icon: CreditCard,
    id: "revenue",
    metricLabels: ["결제 이벤트"],
    title: "매출 관리",
  },
  {
    description: "리서치 agent, 알림 큐, Push, 외부 연동 상태를 점검합니다.",
    icon: Settings,
    id: "system",
    metricLabels: ["트렌드 리서치", "알림 이벤트", "Push 구독"],
    title: "리서치/시스템",
  },
];

const integrationToneStyles = {
  blocked: "border-[#ffad9d]/42 bg-[#391c17] text-[#ffb8aa]",
  partial: "border-[#f3d28a]/42 bg-[#322713] text-[#f3d28a]",
  planned: "border-white/10 bg-white/5 text-[#b8aa95]",
  ready: "border-[#6fc48d]/40 bg-[#173522] text-[#b7e3bb]",
} satisfies Record<IntegrationItem["tone"], string>;

type ReadinessTone = IntegrationItem["tone"];

type LaunchGate = {
  checks: IntegrationItem[];
  icon: LucideIcon;
  title: string;
};

const readinessToneStyles: Record<
  ReadinessTone,
  { badge: string; border: string; dot: string; icon: string }
> = {
  ready: {
    badge: "border-[#6fc48d]/40 bg-[#173522] text-[#b7e3bb]",
    border: "border-[#6fc48d]/24",
    dot: "bg-[#6fc48d]",
    icon: "text-[#b7e3bb]",
  },
  partial: {
    badge: "border-[#f3d28a]/42 bg-[#322713] text-[#f3d28a]",
    border: "border-[#f3d28a]/24",
    dot: "bg-[#f3d28a]",
    icon: "text-[#f3d28a]",
  },
  blocked: {
    badge: "border-[#ffad9d]/42 bg-[#391c17] text-[#ffb8aa]",
    border: "border-[#ffad9d]/24",
    dot: "bg-[#ff9c88]",
    icon: "text-[#ffb8aa]",
  },
  planned: {
    badge: "border-white/10 bg-white/5 text-[#b8aa95]",
    border: "border-white/10",
    dot: "bg-[#8f826f]",
    icon: "text-[#b8aa95]",
  },
};

export function AdminOperationsConsole({
  initialTab,
  integrationItems,
  summary,
}: {
  initialTab?: string;
  integrationItems: IntegrationItem[];
  summary: AdminOperationsSummary;
}) {
  const router = useRouter();
  // 페이지네이션 링크로 재진입할 때 보던 탭이 유지되도록 ?tab= 값을 초기값으로 쓴다.
  const [activeTab, setActiveTab] = useState<AdminOperationCategory>(() =>
    tabs.some((tab) => tab.id === initialTab)
      ? (initialTab as AdminOperationCategory)
      : "customers",
  );
  const [selectedDetail, setSelectedDetail] =
    useState<AdminOperationItemDetail | null>(null);
  const [query, setQuery] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isRefreshing, startRefreshTransition] = useTransition();
  const [isTriggeringNotifications, startNotificationTransition] =
    useTransition();
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const activeSections = useMemo(
    () =>
      filterSections(
        summary.sections.filter((section) => section.categories.includes(activeTab)),
        query,
      ),
    [activeTab, query, summary.sections],
  );
  const tabItemCounts = useMemo(
    () =>
      Object.fromEntries(
        tabs.map((tab) => [
          tab.id,
          summary.sections
            .filter((section) => section.categories.includes(tab.id))
            .reduce((sum, section) => sum + section.items.length, 0),
        ]),
      ) as Record<AdminOperationCategory, number>,
    [summary.sections],
  );

  function refresh() {
    startRefreshTransition(() => router.refresh());
  }

  function triggerNotifications() {
    setNotificationMessage("");
    startNotificationTransition(async () => {
      try {
        const response = await fetch("/api/admin/notifications/", {
          body: JSON.stringify({
            action: "trigger_dispatch",
            limit: 20,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const result = (await response.json()) as AdminNotificationResult;

        if (!response.ok || result.accepted === false) {
          setNotificationMessage(
            result.reason === "trigger_not_configured"
              ? "Trigger.dev 키가 없어 알림 큐를 실행할 수 없습니다."
              : `알림 큐 실행 실패: ${result.reason ?? response.status}`,
          );
          return;
        }

        setNotificationMessage("알림 큐 실행을 요청했습니다.");
        refresh();
      } catch {
        setNotificationMessage("알림 큐 실행 요청 중 네트워크 오류가 발생했습니다.");
      }
    });
  }

  const isHome = activeTab === "home";
  const readyCount = integrationItems.filter(
    (item) => item.tone === "ready",
  ).length;
  const partialCount = integrationItems.filter(
    (item) => item.tone === "partial",
  ).length;
  const blockedCount = integrationItems.filter(
    (item) => item.tone === "blocked",
  ).length;
  const launchGates = buildLaunchGates(integrationItems);

  return (
    <section className="rounded-md border border-[#2b281f] bg-[#171511]/92 p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Database aria-hidden="true" className="text-[#f3d28a]" size={18} />
            <h2 className="text-lg font-semibold text-[#fffaf1]">운영 콘솔</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#b8aa95]">
            왼쪽 메뉴로 업무 영역을 전환하고, 각 항목의 처리 버튼으로 실제 운영
            상태를 변경합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-[#0f0e0c] px-3 text-sm font-semibold text-[#d8cbb8] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a] disabled:cursor-wait disabled:opacity-60"
            disabled={isRefreshing}
            onClick={refresh}
            type="button"
          >
            {isRefreshing ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={15} />
            ) : (
              <RefreshCcw aria-hidden="true" size={15} />
            )}
            새로고침
          </button>
          <span
            className={`rounded-md border px-3 py-2 text-xs font-semibold ${
              summary.connected
                ? "border-[#6fc48d]/40 bg-[#173522] text-[#b7e3bb]"
                : "border-[#ffad9d]/42 bg-[#391c17] text-[#ffb8aa]"
            }`}
          >
            {summary.connected ? "Supabase 연결됨" : "Supabase 연결 대기"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="운영 메뉴" className="grid h-fit gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const count = tabItemCounts[tab.id] ?? 0;

            return (
              <button
                className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                  active
                    ? "border-[#f3d28a] bg-[#2d2414] text-[#fffaf1]"
                    : "border-transparent bg-[#0f0e0c]/60 text-[#d8cbb8] hover:border-[#f3d28a]/40 hover:text-[#f3d28a]"
                }`}
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setQuery("");
                }}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon aria-hidden="true" className="shrink-0" size={16} />
                  <span className="truncate">{tab.title}</span>
                </span>
                {tab.id !== "home" ? (
                  <span className="shrink-0 rounded-md bg-white/8 px-2 py-0.5 text-xs font-bold">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0">
          {!summary.connected ? (
            <div className="rounded-md border border-[#ffad9d]/24 bg-[#391c17]/55 p-4 text-sm leading-6 text-[#ffb8aa]">
              미리룩 전용 Supabase 프로젝트와 service role key가 연결되면 운영
              데이터와 상태 변경 기능이 활성화됩니다.
            </div>
          ) : isHome ? (
            <HomeOverview
              blockedCount={blockedCount}
              integrationItems={integrationItems}
              launchGates={launchGates}
              metrics={summary.metrics}
              partialCount={partialCount}
              readyCount={readyCount}
            />
          ) : (
            <>
              {summary.error ? (
                <div className="mb-4 rounded-md border border-[#ffad9d]/24 bg-[#391c17]/55 p-3 text-sm leading-6 text-[#ffb8aa]">
                  일부 운영 데이터를 읽지 못했습니다: {summary.error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#fffaf1]">
                    {activeTabConfig.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#b8aa95]">
                    {activeTabConfig.description}
                  </p>
                </div>
                <label className="relative block w-full md:w-80">
                  <Search
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f826f]"
                    size={16}
                  />
                  <input
                    className="h-10 w-full rounded-md border border-white/10 bg-[#0f0e0c] px-9 text-sm text-[#fffaf1] outline-none placeholder:text-[#6f6658] focus:border-[#f3d28a]"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="이름, 이메일, ID, 상태 검색"
                    value={query}
                  />
                </label>
              </div>

              {activeTabConfig.metricLabels.length ? (
                <MetricStrip
                  labels={activeTabConfig.metricLabels}
                  metrics={summary.metrics}
                />
              ) : null}

              <div className="mt-4 grid gap-4">
                {activeSections.length ? (
                  activeSections.map((section) => (
                    <AdminSectionView
                      key={section.title}
                      onOpenDetail={setSelectedDetail}
                      section={section}
                    />
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-white/10 bg-[#0f0e0c]/72 px-3 py-5 text-sm text-[#8f826f]">
                    검색 조건에 맞는 운영 항목이 없습니다.
                  </p>
                )}
              </div>

              {activeTab === "system" ? (
                <div className="mt-4 grid gap-4">
                  <section className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-[#fffaf1]">
                          알림 큐 실행
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-[#8f826f]">
                          queued 상태의 Web Push 알림을 Trigger.dev 작업으로 발송 요청합니다.
                        </p>
                      </div>
                      <button
                        className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-[#6fc48d]/40 bg-[#173522] px-3 text-sm font-bold text-[#b7e3bb] transition hover:bg-[#21462d] disabled:cursor-wait disabled:opacity-60"
                        disabled={isTriggeringNotifications}
                        onClick={triggerNotifications}
                        type="button"
                      >
                        {isTriggeringNotifications ? (
                          <Loader2
                            aria-hidden="true"
                            className="animate-spin"
                            size={15}
                          />
                        ) : (
                          <Bell aria-hidden="true" size={15} />
                        )}
                        알림 큐 실행
                      </button>
                    </div>
                    {notificationMessage ? (
                      <p className="mt-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs leading-5 text-[#d8cbb8]">
                        {notificationMessage}
                      </p>
                    ) : null}
                  </section>
                  <IntegrationPanel integrationItems={integrationItems} />
                  <AdminResearchTrendForm />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {selectedDetail ? (
        <AdminConsultationDetailDialog
          detail={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      ) : null}
    </section>
  );
}

function HomeOverview({
  blockedCount,
  integrationItems,
  launchGates,
  metrics,
  partialCount,
  readyCount,
}: {
  blockedCount: number;
  integrationItems: IntegrationItem[];
  launchGates: LaunchGate[];
  metrics: AdminOperationMetric[];
  partialCount: number;
  readyCount: number;
}) {
  return (
    <div className="grid gap-4">
      <div>
        <h3 className="text-xl font-semibold text-[#fffaf1]">운영 홈</h3>
        <p className="mt-1 text-sm leading-6 text-[#b8aa95]">
          핵심 지표와 서비스 연결, 론칭 준비 상태를 한눈에 확인합니다. 실제 업무는
          왼쪽 메뉴에서 처리하세요.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ReadinessSummaryCard
          icon={CheckCircle2}
          label="연결 완료"
          tone="ready"
          value={`${readyCount}`}
        />
        <ReadinessSummaryCard
          icon={AlertTriangle}
          label="부분 준비"
          tone="partial"
          value={`${partialCount}`}
        />
        <ReadinessSummaryCard
          icon={ShieldCheck}
          label="론칭 전 필수"
          tone={blockedCount ? "blocked" : "ready"}
          value={`${blockedCount}`}
        />
      </div>

      <section className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3">
        <h3 className="text-sm font-semibold text-[#fffaf1]">핵심 지표</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <div
              className="rounded-md border border-white/10 bg-[#15130f] p-3"
              key={metric.label}
            >
              <p className="text-xs font-semibold text-[#8f826f]">
                {metric.label}
              </p>
              <p className="mt-1 text-xl font-bold text-[#fffaf1]">
                {metric.value}
              </p>
              {metric.description ? (
                <p className="mt-1 text-xs leading-5 text-[#8f826f]">
                  {metric.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <IntegrationPanel integrationItems={integrationItems} />

      <div className="grid gap-4 xl:grid-cols-2">
        {launchGates.map((gate) => (
          <LaunchGateCard gate={gate} key={gate.title} />
        ))}
      </div>
    </div>
  );
}

function MetricStrip({
  labels,
  metrics,
}: {
  labels: string[];
  metrics: AdminOperationMetric[];
}) {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {labels.map((label) => {
        const metric = metrics.find((item) => item.label === label);

        return (
          <div
            className="rounded-md border border-white/10 bg-[#15130f] p-3"
            key={label}
          >
            <p className="text-xs font-semibold text-[#8f826f]">{label}</p>
            <p className="mt-1 text-xl font-bold text-[#fffaf1]">
              {metric?.value ?? "0"}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ReadinessSummaryCard({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: LucideIcon;
  label: string;
  tone: ReadinessTone;
  value: string;
}) {
  const style = readinessToneStyles[tone];

  return (
    <div className={`rounded-md border ${style.border} bg-[#171511]/92 p-4`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#b8aa95]">{label}</p>
        <Icon aria-hidden="true" className={style.icon} size={18} />
      </div>
      <p className={`mt-4 text-3xl font-bold ${style.icon}`}>{value}</p>
    </div>
  );
}

function LaunchGateCard({ gate }: { gate: LaunchGate }) {
  const Icon = gate.icon;

  return (
    <section className="rounded-md border border-[#2b281f] bg-[#171511]/92 p-4">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="text-[#f3d28a]" size={18} />
        <h3 className="text-lg font-semibold text-[#fffaf1]">{gate.title}</h3>
      </div>
      <div className="mt-4 grid gap-2">
        {gate.checks.map((item) => {
          const style = readinessToneStyles[item.tone];

          return (
            <div
              className={`rounded-md border ${style.border} bg-[#0f0e0c]/72 px-3 py-3`}
              key={`${gate.title}-${item.label}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`size-2 rounded-full ${style.dot}`} />
                  <p className="truncate text-sm font-semibold text-[#fffaf1]">
                    {item.label}
                  </p>
                </div>
                <span
                  className={`rounded-md border px-2 py-1 text-xs font-semibold ${style.badge}`}
                >
                  {item.value}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function launchPlanned(label: string): IntegrationItem {
  return {
    description: "아직 연결되지 않은 운영 항목입니다.",
    label,
    tone: "planned",
    value: "예정",
  };
}

function buildLaunchGates(integrationItems: IntegrationItem[]): LaunchGate[] {
  const integration = new Map(
    integrationItems.map((item) => [item.label, item]),
  );

  return [
    {
      icon: ImageIcon,
      title: "고객 AI 생성",
      checks: [
        integration.get("Live AI") ?? launchPlanned("Live AI"),
        integration.get("OpenAI") ?? launchPlanned("OpenAI"),
        {
          description:
            "남성/여성 모드, 헤어컷/컬러/퍼스널 컨설팅 선택이 고객 플로우에 반영됩니다.",
          label: "남성/여성 추천 UI",
          tone: "ready",
          value: "구현",
        },
        {
          description:
            "선택한 스타일 기준 상담용 9장 생성 플로우가 production에 배포되어 있습니다.",
          label: "상담용 9장",
          tone: "ready",
          value: "구현",
        },
      ],
    },
    {
      icon: Database,
      title: "히스토리 / 저장",
      checks: [
        integration.get("Supabase") ?? launchPlanned("Supabase"),
        {
          description: "브라우저 IndexedDB에 최근 상담 결과를 저장합니다.",
          label: "로컬 히스토리",
          tone: "ready",
          value: "구현",
        },
        {
          description:
            "`/mypage`에서 저장된 상담 결과를 다시 열고 PDF 저장, 공유 링크 생성, 삭제를 처리합니다.",
          label: "고객 히스토리 화면",
          tone: "ready",
          value: "구현",
        },
      ],
    },
    {
      icon: Mail,
      title: "Export / 공유",
      checks: [
        integration.get("Resend") ?? launchPlanned("Resend"),
        {
          description: "인쇄 화면을 통해 상담 보드를 PDF로 저장할 수 있습니다.",
          label: "PDF 저장",
          tone: "ready",
          value: "구현",
        },
        {
          description:
            "Supabase 연결 시 만료형 공유 링크를 만들고 `/share/[token]` 상담 보드로 전달합니다.",
          label: "공유 링크",
          tone: "partial",
          value: "링크 구현",
        },
      ],
    },
    {
      icon: ShieldCheck,
      title: "관리자 / 보안",
      checks: [
        integration.get("Admin Basic Auth") ??
          launchPlanned("Admin Basic Auth"),
        {
          description:
            "고객 화면과 운영 화면이 `/`와 `/admin`으로 분리되어 있습니다.",
          label: "화면 분리",
          tone: "ready",
          value: "구현",
        },
      ],
    },
    {
      icon: Building2,
      title: "입점 / 예약 / 지도",
      checks: [
        {
          description:
            "미용실, 디자이너, 리뷰, 예약 문의 테이블과 파일럿 데이터 구조가 준비되어 있고, 입점 승인 시 공개 프로필을 생성합니다.",
          label: "입점 데이터 모델",
          tone: "partial",
          value: "승인 흐름 구현",
        },
        {
          description:
            "예약 문의와 파일럿 리뷰 접수 API/화면을 연결했습니다.",
          label: "예약",
          tone: "partial",
          value: "폼 구현",
        },
      ],
    },
    {
      icon: Vote,
      title: "커뮤니티 / 투표 / 결제",
      checks: [
        integration.get("PortOne") ?? launchPlanned("PortOne"),
        integration.get("Trigger.dev") ?? launchPlanned("Trigger.dev"),
        integration.get("Web Push") ?? launchPlanned("Web Push"),
      ],
    },
  ];
}

function AdminSectionView({
  onOpenDetail,
  section,
}: {
  onOpenDetail: (detail: AdminOperationItemDetail) => void;
  section: AdminOperationSection;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#fffaf1]">
            {section.title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-[#8f826f]">
            {section.description}
          </p>
        </div>
        <span className="w-fit rounded-md bg-white/7 px-2 py-1 text-xs font-semibold text-[#b8aa95]">
          {section.pagination
            ? `전체 ${section.pagination.total}건 · ${section.pagination.page}/${section.pagination.pageCount}페이지`
            : `${section.items.length}건`}
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        {section.items.length ? (
          section.items.map((item) => (
            <article
              className="rounded-md border border-white/10 bg-[#15130f] p-3"
              key={`${section.title}-${item.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 truncate text-sm font-semibold text-[#fffaf1]">
                  {item.title}
                </p>
                {item.status ? (
                  <span
                    className={`shrink-0 rounded-md border px-2 py-1 text-xs font-semibold ${getAdminStatusBadgeClass(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                ) : null}
              </div>
              {item.subtitle ? (
                <p className="mt-1 whitespace-pre-line break-words text-xs leading-5 text-[#b8aa95]">
                  {item.subtitle}
                </p>
              ) : null}
              {item.meta ? (
                <p className="mt-2 break-words text-xs leading-5 text-[#8f826f]">
                  {item.meta}
                </p>
              ) : null}
              {item.attachments && item.attachments.length > 0 ? (
                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold text-[#b8aa95]">
                    첨부 스크린샷 {item.attachments.length}장
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.attachments.map((image, index) => (
                      <a
                        className="block h-16 w-16 overflow-hidden rounded-md border border-white/10 bg-[#0f0e0c] transition hover:border-[#f3d28a]/60"
                        href={image.imageUrl}
                        key={`${item.id}-attachment-${image.displayOrder ?? index}`}
                        rel="noreferrer"
                        target="_blank"
                        title={`${image.label} 원본 열기`}
                      >
                        <img
                          alt={image.label}
                          className="h-full w-full object-cover"
                          src={image.imageUrl}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
              {item.detail?.type === "consultation_history" ? (
                <button
                  className="mt-3 inline-flex h-9 items-center gap-2 rounded-md border border-[#c9a96a]/50 px-3 text-xs font-bold text-[#f3d28a] transition hover:bg-[#f3d28a]/10"
                  onClick={() => onOpenDetail(item.detail as AdminOperationItemDetail)}
                  type="button"
                >
                  <Eye aria-hidden="true" size={14} />
                  원본/추천/상담 사진 보기
                </button>
              ) : null}
              {section.action ? (
                <AdminStatusActions action={section.action} itemId={item.id} />
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-md border border-dashed border-white/10 px-3 py-4 text-sm text-[#8f826f]">
            {section.emptyText}
          </p>
        )}
      </div>

      {section.pagination && section.pagination.pageCount > 1 ? (
        <AdminSectionPagination pagination={section.pagination} />
      ) : null}
    </section>
  );
}

// 서버 페이지네이션 이동. 페이지를 바꾸면 서버 컴포넌트가 다시 렌더되므로
// ?tab= 을 함께 실어 보던 탭이 유지되게 한다.
function AdminSectionPagination({
  pagination,
}: {
  pagination: NonNullable<AdminOperationSection["pagination"]>;
}) {
  const { page, pageCount, param, tab, total, pageSize } = pagination;
  const pages = buildPageWindow(page, pageCount);
  const firstOnPage = (page - 1) * pageSize + 1;
  const lastOnPage = Math.min(page * pageSize, total);
  const hrefFor = (target: number) => `/admin/?tab=${tab}&${param}=${target}`;

  const baseClass =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-semibold transition";
  const idleClass = `${baseClass} border-white/12 text-[#b8aa95] hover:border-[#f3d28a]/60 hover:text-[#f3d28a]`;
  const activeClass = `${baseClass} border-[#f3d28a]/60 bg-[#f3d28a]/12 text-[#f3d28a]`;
  const disabledClass = `${baseClass} pointer-events-none border-white/8 text-[#5f574a] opacity-60`;

  return (
    <nav
      aria-label="상담 히스토리 페이지"
      className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3"
    >
      <p className="text-xs text-[#8f826f]">
        {total ? `${firstOnPage}–${lastOnPage} / 전체 ${total}건` : "0건"}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <Link
          aria-disabled={page <= 1}
          className={page <= 1 ? disabledClass : idleClass}
          href={hrefFor(Math.max(1, page - 1))}
        >
          이전
        </Link>
        {pages.map((entry, index) =>
          entry === null ? (
            <span
              className="px-1 text-xs text-[#5f574a]"
              key={`gap-${index}`}
            >
              …
            </span>
          ) : (
            <Link
              className={entry === page ? activeClass : idleClass}
              href={hrefFor(entry)}
              key={entry}
            >
              {entry}
            </Link>
          ),
        )}
        <Link
          aria-disabled={page >= pageCount}
          className={page >= pageCount ? disabledClass : idleClass}
          href={hrefFor(Math.min(pageCount, page + 1))}
        >
          다음
        </Link>
      </div>
    </nav>
  );
}

// 1 … 4 [5] 6 … 12 형태로 페이지 버튼을 추린다(null = 생략 표시).
function buildPageWindow(page: number, pageCount: number): Array<number | null> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, pageCount, page]);

  if (page - 1 > 1) pages.add(page - 1);
  if (page + 1 < pageCount) pages.add(page + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: Array<number | null> = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) {
      result.push(null);
    }

    result.push(value);
  });

  return result;
}

function AdminConsultationDetailDialog({
  detail,
  onClose,
}: {
  detail: AdminOperationItemDetail;
  onClose: () => void;
}) {
  const groups = [
    {
      description: "고객이 상담 전에 업로드한 원본 사진입니다.",
      images: detail.sourcePhotos,
      title: "1. 고객 원본 사진",
    },
    {
      description: "고객이 추천받은 스타일 후보 이미지입니다.",
      images: detail.recommendationImages,
      title: "2. 추천 받은 스타일 9장",
    },
    {
      description: "선택 스타일 기준으로 생성된 각도별 상담 이미지입니다.",
      images: detail.consultationImages,
      title: "3. 상담용 이미지 9장",
    },
    {
      description: "프리미엄 코디(전신/의상/액세서리) 추천 이미지입니다.",
      images: detail.outfitImages,
      title: "4. 코디 추천 이미지",
    },
  ].filter((group) => group.images.length > 0);

  return (
    <div
      aria-label="상담 히스토리 사진 상세"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-md border border-[#2b281f] bg-[#11100e] shadow-2xl shadow-black/60"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-white/10 bg-[#171511]/95 p-4 backdrop-blur">
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#f3d28a]">
              상담 히스토리 상세
            </p>
            <h3 className="mt-1 truncate text-xl font-bold text-[#fffaf1]">
              {detail.styleName || "미리룩 상담 결과"}
            </h3>
            <p className="mt-1 text-xs leading-5 text-[#8f826f]">
              {detail.createdAt ? formatAdminDate(detail.createdAt) : ""}
            </p>
          </div>
          <button
            aria-label="상세 창 닫기"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-white/12 bg-[#0f0e0c] text-[#d8cbb8] transition hover:bg-white/10 hover:text-[#fffaf1]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-4">
          <div className="grid gap-2 rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3 text-xs leading-5 text-[#d8cbb8] md:grid-cols-2">
            <AdminDetailMeta label="고객 ID" value={detail.customerId} />
            <AdminDetailMeta label="이메일" value={detail.customerEmail} />
            <AdminDetailMeta label="고객명" value={detail.customerDisplayName} />
            <AdminDetailMeta label="세션 ID" value={detail.sessionId} />
            <AdminDetailMeta label="대상" value={detail.audienceName} />
            <AdminDetailMeta label="헤어 컬러" value={detail.hairColorName} />
            <AdminDetailMeta label="지역" value={detail.regionName} />
          </div>

          {detail.memo ? (
            <div className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3">
              <p className="text-xs font-bold text-[#8f826f]">고객 메모</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#d8cbb8]">
                {detail.memo}
              </p>
            </div>
          ) : null}

          {groups.map((group) => (
            <AdminConsultationImageGroup
              description={group.description}
              images={group.images}
              key={group.title}
              title={group.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDetailMeta({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="min-w-0 rounded-md bg-white/5 px-3 py-2">
      <p className="text-[11px] font-bold text-[#8f826f]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#fffaf1]">
        {value || "-"}
      </p>
    </div>
  );
}

function AdminConsultationImageGroup({
  description,
  images,
  title,
}: {
  description: string;
  images: AdminOperationImage[];
  title: string;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-[#fffaf1]">{title}</h4>
          <p className="mt-1 text-xs leading-5 text-[#8f826f]">
            {description}
          </p>
        </div>
        <span className="rounded-md bg-white/7 px-2 py-1 text-xs font-bold text-[#b8aa95]">
          {images.length}장
        </span>
      </div>
      {images.length ? (
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <a
              className="group overflow-hidden rounded-md border border-white/10 bg-[#15130f] transition hover:border-[#f3d28a]/60"
              href={image.imageUrl}
              key={`${image.assetType ?? "image"}-${image.displayOrder ?? index}-${image.label}`}
              rel="noreferrer"
              target="_blank"
            >
              <div className="relative aspect-square overflow-hidden bg-[#080705]">
                <img
                  alt={`${title} ${image.label}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                  src={image.imageUrl}
                />
                <span className="absolute left-2 top-2 rounded-md bg-[#11100e]/82 px-2 py-1 text-[11px] font-bold text-[#f3d28a]">
                  {image.label}
                </span>
              </div>
              <div className="flex items-center gap-2 px-2 py-2 text-xs font-semibold text-[#b8aa95]">
                <ImageIcon aria-hidden="true" size={13} />
                <span className="truncate">{image.label}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-md border border-dashed border-white/10 px-3 py-4 text-sm text-[#8f826f]">
          저장된 사진이 없습니다.
        </p>
      )}
    </section>
  );
}

function getAdminStatusBadgeClass(status: string) {
  const normalized = status.trim().toLowerCase();
  const hairMoneyMatch = normalized.match(/^h?머니\s*(\d+)개$/);

  if (hairMoneyMatch) {
    const balance = Number(hairMoneyMatch[1] ?? 0);

    return balance > 0
      ? "border-[#6fc48d]/40 bg-[#173522] text-[#b7e3bb]"
      : "border-[#f3d28a]/42 bg-[#322713] text-[#f3d28a]";
  }

  if (
    [
      "active",
      "approved",
      "completed",
      "credit",
      "published",
      "refunded",
      "resolved",
      "sent",
    ].includes(normalized)
  ) {
    return "border-[#6fc48d]/40 bg-[#173522] text-[#b7e3bb]";
  }

  if (["debit", "done", "pending", "queued", "reviewing"].includes(normalized)) {
    return "border-[#f3d28a]/42 bg-[#322713] text-[#f3d28a]";
  }

  if (["delivered", "contacted", "waiting_customer"].includes(normalized)) {
    return "border-[#9cc8ff]/35 bg-[#102136] text-[#bcd5ef]";
  }

  if (
    ["cancelled", "disabled", "dismissed", "failed", "hidden", "rejected", "revoked"].includes(
      normalized,
    )
  ) {
    return "border-[#ffad9d]/42 bg-[#391c17] text-[#ffb8aa]";
  }

  return "border-white/10 bg-white/7 text-[#b8aa95]";
}

function IntegrationPanel({
  integrationItems,
}: {
  integrationItems: IntegrationItem[];
}) {
  return (
    <section className="rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3">
      <h3 className="text-sm font-semibold text-[#fffaf1]">서비스 연결</h3>
      <div className="mt-3 grid gap-2">
        {integrationItems.map((item) => (
          <div
            className="rounded-md border border-white/10 bg-[#15130f] p-3"
            key={item.label}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#d8cbb8]">
                {item.label}
              </p>
              <span
                className={`rounded-md border px-2 py-1 text-xs font-bold ${integrationToneStyles[item.tone]}`}
              >
                {item.value}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#8f826f]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatAdminDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function filterSections(sections: AdminOperationSection[], query: string) {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return sections;
  }

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        [item.id, item.title, item.subtitle, item.meta, item.status]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle),
      ),
    }))
    .filter((section) => section.items.length);
}
