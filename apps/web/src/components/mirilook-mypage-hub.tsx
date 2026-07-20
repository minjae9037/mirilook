"use client";

// 마이페이지 허브 — 하트스코어 /me 처럼 카테고리 메뉴에서 항목을 골라 들어가는 구조.
// 기존엔 모든 패널(프로필·알림·비밀번호·기록·계정삭제)이 세로로 길게 쌓여 있어 구분이
// 어려웠다. 여기서는 허브(메뉴 리스트)에서 카테고리를 탭하면 해당 화면만 보여준다.
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  Bell,
  ChevronRight,
  FileText,
  Flag,
  HeartHandshake,
  KeyRound,
  MessageCircle,
  ScrollText,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { MirilookAccountDeletion } from "@/components/mirilook-account-deletion";
import { MirilookBlockedMembers } from "@/components/mirilook-blocked-members";
import { MirilookDmInbox } from "@/components/mirilook-dm-inbox";
import { MirilookHistoryManager } from "@/components/mirilook-history-manager";
import { MirilookNotificationPreferences } from "@/components/mirilook-notification-preferences";
import { MirilookPasswordSettings } from "@/components/mirilook-password-settings";
import { MirilookProfilePanel } from "@/components/mirilook-profile-panel";
import { MirilookReportHistory } from "@/components/mirilook-report-history";

type DetailView =
  | "profile"
  | "history"
  | "dm"
  | "blocked"
  | "reports"
  | "notifications"
  | "password"
  | "account";
type View = "hub" | DetailView;

const VIEW_TITLE: Record<DetailView, string> = {
  profile: "프로필 관리",
  history: "내 상담 기록 · 매칭",
  dm: "DM 대화함",
  blocked: "차단한 회원 관리",
  reports: "신고 이력",
  notifications: "알림 설정",
  password: "비밀번호 변경",
  account: "계정 관리",
};

export function MirilookMyPageHub() {
  const [view, setView] = useState<View>("hub");

  if (view === "hub") {
    return <Hub onSelect={setView} />;
  }

  return (
    <div className="grid min-w-0 gap-5">
      <BackBar title={VIEW_TITLE[view]} onBack={() => setView("hub")} />
      {view === "profile" ? <MirilookProfilePanel /> : null}
      {view === "history" ? <MirilookHistoryManager /> : null}
      {view === "dm" ? <MirilookDmInbox /> : null}
      {view === "blocked" ? <MirilookBlockedMembers /> : null}
      {view === "reports" ? <MirilookReportHistory /> : null}
      {view === "notifications" ? <MirilookNotificationPreferences /> : null}
      {view === "password" ? <MirilookPasswordSettings /> : null}
      {view === "account" ? <MirilookAccountDeletion /> : null}
    </div>
  );
}

function Hub({ onSelect }: { onSelect: (view: DetailView) => void }) {
  return (
    <div className="grid min-w-0 gap-5">
      <MenuGroup title="내 프로필">
        <MenuRow
          icon={<UserRound size={18} />}
          label="프로필 · 기준 사진"
          description="닉네임, 자기소개, 추천용 얼굴 사진"
          onClick={() => onSelect("profile")}
        />
      </MenuGroup>

      <MenuGroup title="내 활동">
        <MenuRow
          icon={<HeartHandshake size={18} />}
          label="상담 기록 · 나의 매칭"
          description="추천 히스토리, H머니 내역, 매칭"
          onClick={() => onSelect("history")}
        />
      </MenuGroup>

      <MenuGroup title="커뮤니티 관리">
        <MenuRow
          icon={<MessageCircle size={18} />}
          label="DM 대화함"
          description="주고받은 DM 확인 · 답장 · 상대 신고/차단"
          onClick={() => onSelect("dm")}
        />
        <MenuRow
          icon={<Ban size={18} />}
          label="차단한 회원"
          description="차단 목록 확인 · 차단 해제"
          onClick={() => onSelect("blocked")}
        />
        <MenuRow
          icon={<Flag size={18} />}
          label="신고 이력"
          description="내가 접수한 신고와 처리 상태"
          onClick={() => onSelect("reports")}
        />
      </MenuGroup>

      <MenuGroup title="설정">
        <MenuRow
          icon={<Bell size={18} />}
          label="알림 설정"
          onClick={() => onSelect("notifications")}
        />
        <MenuRow
          icon={<KeyRound size={18} />}
          label="비밀번호 변경"
          onClick={() => onSelect("password")}
        />
      </MenuGroup>

      <MenuGroup title="약관 · 정책">
        <MenuRow icon={<ScrollText size={18} />} label="이용약관" href="/terms" />
        <MenuRow
          icon={<FileText size={18} />}
          label="개인정보처리방침"
          href="/privacy"
        />
        <MenuRow icon={<FileText size={18} />} label="환불정책" href="/refund" />
      </MenuGroup>

      <MenuGroup title="계정">
        <MenuRow
          icon={<ShieldAlert size={18} />}
          label="계정 삭제"
          description="계정과 데이터를 영구 삭제"
          danger
          onClick={() => onSelect("account")}
        />
      </MenuGroup>
    </div>
  );
}

function MenuGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0">
      <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-[#8f826f]">
        {title}
      </p>
      <div className="overflow-hidden rounded-2xl border border-[#2b281f] bg-[#0f0e0c]/72">
        {children}
      </div>
    </section>
  );
}

function MenuRow({
  icon,
  label,
  description,
  onClick,
  href,
  danger = false,
}: {
  icon?: ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        {icon ? (
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-xl ${
              danger
                ? "bg-[#2a1411] text-[#ffb8aa]"
                : "bg-[#171511] text-[#f3d28a]"
            }`}
          >
            {icon}
          </span>
        ) : null}
        <span className="min-w-0">
          <span
            className={`block truncate text-sm font-bold ${
              danger ? "text-[#ffb8aa]" : "text-[#fffaf1]"
            }`}
          >
            {label}
          </span>
          {description ? (
            <span className="mt-0.5 block truncate text-xs text-[#b8aa95]">
              {description}
            </span>
          ) : null}
        </span>
      </span>
      <ChevronRight aria-hidden="true" className="shrink-0 text-[#8f826f]" size={18} />
    </>
  );

  const className =
    "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03] [&:not(:first-child)]:border-t [&:not(:first-child)]:border-[#2b281f]";

  if (href) {
    return (
      <Link className={className} href={href}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {inner}
    </button>
  );
}

function BackBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="뒤로"
        className="inline-flex size-10 items-center justify-center rounded-full border border-[#2b281f] bg-[#0f0e0c]/72 text-[#d8cbb8] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a]"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft aria-hidden="true" size={18} />
      </button>
      <h2 className="text-lg font-bold text-[#fffaf1]">{title}</h2>
    </div>
  );
}
