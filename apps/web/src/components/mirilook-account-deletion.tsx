"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatHairMoney } from "@/lib/mirilook-payments";
import {
  getSupabaseAccessToken,
  getSupabaseBrowserClient,
} from "@/lib/supabase-browser";

type AccountSummary = {
  consultationCount: number;
  email: string | null;
  hairMoneyBalance: number;
  supportEmail: string;
};

export function MirilookAccountDeletion() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    getSupabaseAccessToken()
      .then(async (token) => {
        if (!token) {
          return null;
        }

        const response = await fetch("/api/account/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        return response.ok ? ((await response.json()) as AccountSummary) : null;
      })
      .then((data) => {
        if (mounted && data) {
          setSummary(data);
        }
      })
      .catch(() => null);

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function deleteAccount() {
    if (!summary) {
      return;
    }

    // 되돌릴 수 없다. 이메일을 직접 입력하게 해서 오조작을 막는다.
    if (confirmEmail.trim().toLowerCase() !== (summary.email ?? "").toLowerCase()) {
      setError("확인을 위해 계정 이메일을 정확히 입력해 주세요.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const token = await getSupabaseAccessToken();

      if (!token) {
        setError("로그인이 만료되었습니다. 다시 로그인한 뒤 시도해 주세요.");
        return;
      }

      const response = await fetch("/api/account/", {
        headers: { Authorization: `Bearer ${token}` },
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          reason?: string;
        } | null;

        setError(
          `계정을 삭제하지 못했습니다.${body?.reason ? ` (${body.reason})` : ""} 잠시 후 다시 시도하거나 ${summary.supportEmail}으로 문의해 주세요.`,
        );
        return;
      }

      await supabase?.auth.signOut();
      router.replace("/");
    } catch {
      setError("계정을 삭제하지 못했습니다. 네트워크 상태를 확인해 주세요.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (!summary) {
    return null;
  }

  return (
    <section className="grid gap-4 rounded-lg border border-[#ff8f8f]/30 bg-[#171511]/92 p-4 shadow-2xl shadow-black/40 backdrop-blur md:p-5">
      <div>
        <div className="flex items-center gap-2">
          <Trash2 aria-hidden="true" className="text-[#ffb3a6]" size={20} />
          <h2 className="text-xl font-semibold text-[#fffaf1]">계정 삭제</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
          계정과 업로드한 얼굴 사진, 상담 결과가 삭제됩니다. 되돌릴 수 없습니다.
        </p>
      </div>

      <ul className="grid gap-1.5 rounded-md border border-white/10 bg-[#0f0e0c]/72 p-3 text-xs leading-5 text-[#e7dccb]">
        <li>· 삭제되는 항목: 계정 정보, 프로필, 업로드한 얼굴 사진, 상담 결과·생성 이미지({summary.consultationCount}건)</li>
        <li>
          · 남는 항목: 커뮤니티 글·댓글은 <b className="text-[#fffaf1]">작성자 정보가 지워진 익명 상태</b>로 남습니다.
        </li>
        <li>· 결제·환불 기록은 법령상 보관 의무가 있는 범위에서 보존될 수 있습니다.</li>
        {summary.hairMoneyBalance > 0 ? (
          <li className="text-[#ffb3a6]">
            · ⚠️ 보유한 <b>{formatHairMoney(summary.hairMoneyBalance)} Hair Money가 함께 소멸</b>되며 환불되지 않습니다.
          </li>
        ) : null}
      </ul>

      {isOpen ? (
        <div className="grid gap-3 rounded-md border border-[#ff8f8f]/40 bg-[#3a1c1c]/40 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-[#ffb3a6]" size={16} />
            <p className="text-sm leading-6 text-[#ffb3a6]">
              정말 삭제하려면 계정 이메일 <b className="text-[#fffaf1]">{summary.email}</b>을 입력하세요.
            </p>
          </div>
          <input
            autoComplete="off"
            className="h-11 rounded-md border border-white/10 bg-[#11100e] px-3 text-sm text-[#fffaf1] outline-none transition placeholder:text-[#8f826f] focus:border-[#ff8f8f]/70"
            onChange={(event) => setConfirmEmail(event.target.value)}
            placeholder={summary.email ?? "계정 이메일"}
            value={confirmEmail}
          />
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[#c0392b] px-4 text-sm font-bold text-white transition hover:bg-[#e04b3a] disabled:cursor-not-allowed disabled:bg-[#5a2f2a] disabled:text-[#b8aa95]"
              disabled={isDeleting}
              onClick={() => void deleteAccount()}
              type="button"
            >
              {isDeleting ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={16} />
              ) : (
                <Trash2 aria-hidden="true" size={16} />
              )}
              영구 삭제
            </button>
            <button
              className="inline-flex h-11 items-center rounded-md border border-white/15 px-4 text-sm font-semibold text-[#d8cbb8] transition hover:bg-white/5"
              disabled={isDeleting}
              onClick={() => {
                setIsOpen(false);
                setConfirmEmail("");
                setError("");
              }}
              type="button"
            >
              취소
            </button>
          </div>
          {error ? (
            <p className="rounded-md border border-[#ff8f8f]/40 bg-[#3a1c1c]/60 px-3 py-2 text-sm leading-6 text-[#ffb3a6]">
              {error}
            </p>
          ) : null}
        </div>
      ) : (
        <button
          className="inline-flex h-11 w-fit items-center gap-2 rounded-md border border-[#ff8f8f]/45 px-4 text-sm font-bold text-[#ffb3a6] transition hover:bg-[#3a1c1c]/50"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Trash2 aria-hidden="true" size={16} />
          계정 삭제하기
        </button>
      )}

      <p className="text-xs leading-5 text-[#8f826f]">
        직접 삭제가 어려우면 {summary.supportEmail}으로 요청하셔도 됩니다.
      </p>
    </section>
  );
}
