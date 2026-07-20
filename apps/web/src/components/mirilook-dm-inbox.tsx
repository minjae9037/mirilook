"use client";

// 마이페이지 "DM 대화함" — 내 DM 대화 목록을 보고, 대화에 들어가 메시지를 주고받고,
// 대화 중 상대 회원을 신고/차단할 수 있다. 데이터는 커뮤니티와 동일한
// /api/community/social-messages API를 사용한다.
import {
  ArrowLeft,
  Ban,
  Flag,
  Loader2,
  RefreshCcw,
  Send,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getSupabaseAccessToken } from "@/lib/supabase-browser";

type DmProfile = {
  avatarUrl?: string;
  bio?: string;
  displayName: string;
  handle: string;
  id: string;
};

type DmMessage = {
  attachmentUrls?: string[];
  body: string;
  createdAt: string;
  id: string;
  isMine: boolean;
  senderDisplayName: string;
};

type DmThread = {
  conversationKey: string;
  lastMessageAt: string;
  messages: DmMessage[];
  partner: DmProfile;
  postId?: string | null;
  postSummary: string;
  unreadCount?: number;
};

const REPORT_REASONS = [
  "부적절한 내용",
  "괴롭힘/비방",
  "성적/음란 메시지",
  "광고/스팸",
  "사칭/사기 의심",
  "기타 운영 확인 필요",
];

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MirilookDmInbox() {
  const [threads, setThreads] = useState<DmThread[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [actionBusy, setActionBusy] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportStatus, setReportStatus] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread =
    threads.find((thread) => thread.conversationKey === activeKey) ?? null;

  async function loadThreads(options?: { silent?: boolean }) {
    try {
      // await를 먼저 두어 effect에서 호출 시 동기 setState가 일어나지 않게 한다.
      const token = await getSupabaseAccessToken();

      if (!options?.silent) {
        setIsLoading(true);
      }

      if (!token) {
        setStatus("로그인 후 DM 대화함을 확인할 수 있습니다.");
        setThreads([]);
        return;
      }

      const response = await fetch("/api/community/social-messages/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json().catch(() => ({}))) as {
        threads?: DmThread[];
      };

      setThreads(Array.isArray(data.threads) ? data.threads : []);
    } catch {
      setStatus("DM 대화함을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void (async () => {
      await loadThreads();
    })();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [activeThread?.messages.length, activeKey]);

  async function sendReply() {
    if (!activeThread || !replyBody.trim()) {
      return;
    }

    setIsSending(true);
    setStatus("");

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setStatus("로그인 후 답장할 수 있습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("body", replyBody);
      formData.append("conversationKey", activeThread.conversationKey);
      if (activeThread.postId) {
        formData.append("postId", activeThread.postId);
      }
      formData.append("recipientDisplayName", activeThread.partner.displayName);
      formData.append("recipientHandle", activeThread.partner.handle);
      formData.append("recipientProfileId", activeThread.partner.id);

      const response = await fetch("/api/community/social-messages/", {
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
      });

      if (!response.ok) {
        setStatus("메시지 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setReplyBody("");
      await loadThreads({ silent: true });
    } catch {
      setStatus("메시지 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  }

  async function blockPartner() {
    if (!activeThread) {
      return;
    }

    if (
      !window.confirm(
        `${activeThread.partner.displayName}님을 차단할까요?\n차단하면 이 회원의 게시물이 피드에서 사라지고, 운영자에게 통지됩니다.`,
      )
    ) {
      return;
    }

    setActionBusy("block");

    try {
      const token = await getSupabaseAccessToken();
      await fetch("/api/community/block/", {
        body: JSON.stringify({ blockedProfileId: activeThread.partner.id }),
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        method: "POST",
      });
      setThreads((current) =>
        current.filter((thread) => thread.conversationKey !== activeKey),
      );
      setActiveKey("");
      setStatus("해당 회원을 차단했습니다.");
    } catch {
      setStatus("차단 중 오류가 발생했습니다.");
    } finally {
      setActionBusy("");
    }
  }

  async function submitReport() {
    if (!activeThread) {
      return;
    }

    setActionBusy("report");
    setReportStatus("");

    try {
      const token = await getSupabaseAccessToken();
      const response = await fetch("/api/moderation/reports/", {
        body: JSON.stringify({
          body: `DM 대화 상대 신고 (${activeThread.conversationKey})`,
          reason: reportReason,
          targetId: activeThread.partner.id,
          targetType: "user",
        }),
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        method: "POST",
      });

      if (!response.ok) {
        setReportStatus("신고 접수에 실패했습니다.");
        return;
      }

      setReportStatus("신고가 접수되었습니다. 운영자가 24시간 이내에 확인합니다.");
    } catch {
      setReportStatus("신고 접수 중 오류가 발생했습니다.");
    } finally {
      setActionBusy("");
    }
  }

  // ── 대화 상세 화면 ──────────────────────────────────────────────
  if (activeThread) {
    return (
      <section className="rounded-2xl border border-[#2b281f] bg-[#0f0e0c]/72">
        <header className="flex items-center gap-2 border-b border-[#2b281f] p-3">
          <button
            aria-label="대화 목록으로"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#2b281f] bg-[#11100e] text-[#d8cbb8] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a]"
            onClick={() => {
              setActiveKey("");
              setIsReportOpen(false);
              setReportStatus("");
            }}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={18} />
          </button>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#171511] text-[#f3d28a]">
            <UserRound aria-hidden="true" size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-[#fffaf1]">
              {activeThread.partner.displayName}
            </span>
            <span className="block truncate text-xs text-[#b8aa95]">
              @{activeThread.partner.handle}
            </span>
          </span>
          <button
            aria-label="상대 신고"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[#d8cbb8] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a]"
            onClick={() => setIsReportOpen((current) => !current)}
            type="button"
          >
            <Flag aria-hidden="true" size={16} />
          </button>
          <button
            aria-label="상대 차단"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[#ff7a7a]/35 bg-[#2a1411] text-[#ff9a9a] transition hover:bg-[#391c17] disabled:opacity-55"
            disabled={actionBusy === "block"}
            onClick={() => void blockPartner()}
            type="button"
          >
            {actionBusy === "block" ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={16} />
            ) : (
              <Ban aria-hidden="true" size={16} />
            )}
          </button>
        </header>

        {isReportOpen ? (
          <div className="border-b border-[#2b281f] bg-[#17130d] p-3">
            <p className="text-sm font-bold text-[#fffaf1]">이 회원 신고하기</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <select
                className="h-10 flex-1 rounded-md border border-white/10 bg-[#0f0e0c] px-2 text-sm text-[#fffaf1] outline-none focus:border-[#f3d28a]/70"
                onChange={(event) => setReportReason(event.target.value)}
                value={reportReason}
              >
                {REPORT_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#f3d28a]/35 bg-[#2d2414] px-4 text-sm font-bold text-[#f3d28a] transition hover:bg-[#3a2e18] disabled:opacity-55"
                disabled={actionBusy === "report"}
                onClick={() => void submitReport()}
                type="button"
              >
                {actionBusy === "report" ? (
                  <Loader2 aria-hidden="true" className="animate-spin" size={15} />
                ) : (
                  <Flag aria-hidden="true" size={15} />
                )}
                신고 접수
              </button>
            </div>
            {reportStatus ? (
              <p className="mt-2 text-sm font-semibold text-[#f3d28a]">
                {reportStatus}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="max-h-[52vh] min-h-40 overflow-y-auto p-3">
          <div className="grid gap-2">
            {activeThread.messages.map((message) => (
              <div
                className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
                key={message.id}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    message.isMine
                      ? "bg-[#f3d28a] text-[#1a1712]"
                      : "border border-white/10 bg-[#171511] text-[#f8f1e5]"
                  }`}
                >
                  {message.attachmentUrls?.length ? (
                    <div className="mb-1 grid gap-1">
                      {message.attachmentUrls.map((url) => (
                        <img
                          alt="첨부 이미지"
                          className="max-h-52 w-full rounded-lg object-cover"
                          key={url}
                          src={url}
                        />
                      ))}
                    </div>
                  ) : null}
                  {message.body ? <p className="whitespace-pre-wrap">{message.body}</p> : null}
                  <p
                    className={`mt-1 text-[10px] ${
                      message.isMine ? "text-[#6f5a2c]" : "text-[#8f826f]"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form
          className="flex items-center gap-2 border-t border-[#2b281f] p-3"
          onSubmit={(event) => {
            event.preventDefault();
            void sendReply();
          }}
        >
          <input
            className="h-11 min-w-0 flex-1 rounded-md border border-white/10 bg-[#0f0e0c] px-3 text-sm text-[#fffaf1] outline-none placeholder:text-[#8f826f] focus:border-[#f3d28a]/70"
            onChange={(event) => setReplyBody(event.target.value)}
            placeholder="메시지를 입력하세요"
            value={replyBody}
          />
          <button
            aria-label="보내기"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-[#f3d28a] text-[#1a1712] transition hover:bg-[#ffdf98] disabled:cursor-not-allowed disabled:opacity-55"
            disabled={isSending || !replyBody.trim()}
            type="submit"
          >
            {isSending ? (
              <Loader2 aria-hidden="true" className="animate-spin" size={18} />
            ) : (
              <Send aria-hidden="true" size={18} />
            )}
          </button>
        </form>
        {status ? (
          <p className="px-3 pb-3 text-sm font-semibold text-[#f3d28a]">{status}</p>
        ) : null}
      </section>
    );
  }

  // ── 대화 목록 화면 ──────────────────────────────────────────────
  return (
    <section className="rounded-2xl border border-[#2b281f] bg-[#0f0e0c]/72 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-[#fffaf1]">
          DM 대화함{threads.length ? ` · ${threads.length}개` : ""}
        </h2>
        <button
          aria-label="새로고침"
          className="inline-flex size-9 items-center justify-center rounded-md border border-[#2b281f] bg-[#11100e] text-[#d8cbb8] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a]"
          onClick={() => void loadThreads()}
          type="button"
        >
          <RefreshCcw aria-hidden="true" size={16} />
        </button>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
        커뮤니티에서 주고받은 DM 대화입니다. 대화를 눌러 메시지를 확인하고 답장할
        수 있으며, 대화 안에서 상대를 신고하거나 차단할 수 있습니다.
      </p>

      {isLoading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#b8aa95]">
          <Loader2 aria-hidden="true" className="animate-spin" size={16} />
          불러오는 중…
        </div>
      ) : threads.length ? (
        <ul className="mt-4 grid gap-2">
          {threads.map((thread) => {
            const lastMessage = thread.messages[thread.messages.length - 1];

            return (
              <li key={thread.conversationKey}>
                <button
                  className="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-[#11100e]/60 px-3 py-3 text-left transition hover:border-[#f3d28a]/40"
                  onClick={() => setActiveKey(thread.conversationKey)}
                  type="button"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#171511] text-[#f3d28a]">
                    <UserRound aria-hidden="true" size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold text-[#fffaf1]">
                        {thread.partner.displayName}
                      </span>
                      {thread.unreadCount ? (
                        <span className="shrink-0 rounded-full bg-[#f06f91] px-2 py-0.5 text-[10px] font-black text-white">
                          {thread.unreadCount}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[#b8aa95]">
                      {lastMessage
                        ? `${lastMessage.isMine ? "나: " : ""}${lastMessage.body || "사진"}`
                        : thread.postSummary || "대화를 시작해 보세요"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-white/8 bg-[#11100e]/60 px-3 py-6 text-center text-sm text-[#b8aa95]">
          아직 주고받은 DM이 없습니다. 커뮤니티에서 다른 회원에게 DM을 보내면 여기
          모입니다.
        </p>
      )}

      {status ? (
        <p className="mt-3 text-sm font-semibold text-[#f3d28a]">{status}</p>
      ) : null}
    </section>
  );
}
