"use client";

// 마이페이지 "신고 이력" — 내가 접수한 신고 목록과 상태를 보여주고, 아직 처리 전인 신고는 취소한다.
import { Flag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseAccessToken } from "@/lib/supabase-browser";

type MyReport = {
  createdAt: string | null;
  id: string;
  reason: string;
  status: string;
  statusLabel: string;
  targetLabel: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusStyle(status: string) {
  switch (status) {
    case "resolved":
      return { background: "#173a25", color: "#8fe0ab" };
    case "reviewing":
      return { background: "#30271a", color: "#f3d28a" };
    case "dismissed":
      return { background: "#2a1411", color: "#ffb8aa" };
    default:
      return { background: "#171511", color: "#d8cbb8" };
  }
}

export function MirilookReportHistory() {
  const [reports, setReports] = useState<MyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const token = await getSupabaseAccessToken();

        if (!token) {
          if (!cancelled) {
            setStatus("로그인 후 신고 이력을 확인할 수 있습니다.");
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch("/api/moderation/my-reports/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await response.json().catch(() => ({}))) as {
          reports?: MyReport[];
        };

        if (!cancelled) {
          setReports(Array.isArray(data.reports) ? data.reports : []);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setStatus("신고 이력을 불러오지 못했습니다.");
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function withdraw(report: MyReport) {
    setBusyId(report.id);
    setStatus("");

    try {
      const token = await getSupabaseAccessToken();
      const response = await fetch("/api/moderation/my-reports/", {
        body: JSON.stringify({ reportId: report.id }),
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        method: "DELETE",
      });

      if (!response.ok) {
        setStatus(
          response.status === 409
            ? "이미 운영자가 확인 중이라 취소할 수 없습니다."
            : "신고 취소에 실패했습니다.",
        );
        return;
      }

      setReports((current) => current.filter((item) => item.id !== report.id));
      setStatus("신고를 취소했습니다.");
    } catch {
      setStatus("신고 취소 중 오류가 발생했습니다.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="rounded-2xl border border-[#2b281f] bg-[#0f0e0c]/72 p-4">
      <div className="flex items-center gap-2">
        <Flag aria-hidden="true" className="text-[#f3d28a]" size={18} />
        <h2 className="text-lg font-bold text-[#fffaf1]">신고 이력</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
        내가 접수한 신고와 처리 상태입니다. 운영자는 신고를 24시간 이내에 확인해
        조치합니다. 아직 처리 전인 신고는 취소할 수 있습니다.
      </p>

      {isLoading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#b8aa95]">
          <Loader2 aria-hidden="true" className="animate-spin" size={16} />
          불러오는 중…
        </div>
      ) : reports.length ? (
        <ul className="mt-4 grid gap-2">
          {reports.map((report) => (
            <li
              className="rounded-xl border border-white/8 bg-[#11100e]/60 px-3 py-3"
              key={report.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[#fffaf1]">
                    {report.targetLabel} · {report.reason}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#b8aa95]">
                    {formatDate(report.createdAt)}
                  </span>
                </span>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
                  style={statusStyle(report.status)}
                >
                  {report.statusLabel}
                </span>
              </div>
              {report.status === "new" ? (
                <div className="mt-2 flex justify-end">
                  <button
                    className="rounded-md border border-white/12 px-3 py-1.5 text-xs font-semibold text-[#d8cbb8] transition hover:border-[#f3d28a]/60 hover:text-[#f3d28a] disabled:cursor-not-allowed disabled:opacity-55"
                    disabled={busyId === report.id}
                    onClick={() => void withdraw(report)}
                    type="button"
                  >
                    {busyId === report.id ? (
                      <Loader2 aria-hidden="true" className="animate-spin" size={14} />
                    ) : (
                      "신고 취소"
                    )}
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-white/8 bg-[#11100e]/60 px-3 py-6 text-center text-sm text-[#b8aa95]">
          접수한 신고가 없습니다.
        </p>
      )}

      {status ? (
        <p className="mt-3 text-sm font-semibold text-[#f3d28a]">{status}</p>
      ) : null}
    </section>
  );
}
