"use client";

// 마이페이지 "차단한 회원 관리" — 내가 차단한 회원 목록을 보여주고 차단을 해제한다.
import { Ban, Loader2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseAccessToken } from "@/lib/supabase-browser";

type BlockedMember = {
  blockedAt: string | null;
  displayName: string;
  handle: string;
  id: string;
};

export function MirilookBlockedMembers() {
  const [members, setMembers] = useState<BlockedMember[]>([]);
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
            setStatus("로그인 후 차단 목록을 확인할 수 있습니다.");
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch("/api/community/block/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await response.json().catch(() => ({}))) as {
          blocked?: BlockedMember[];
        };

        if (!cancelled) {
          setMembers(Array.isArray(data.blocked) ? data.blocked : []);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setStatus("차단 목록을 불러오지 못했습니다.");
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function unblock(member: BlockedMember) {
    setBusyId(member.id);
    setStatus("");

    try {
      const token = await getSupabaseAccessToken();
      const response = await fetch("/api/community/block/", {
        body: JSON.stringify({ blockedProfileId: member.id }),
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        method: "DELETE",
      });

      if (!response.ok) {
        setStatus("차단 해제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setMembers((current) => current.filter((item) => item.id !== member.id));
      setStatus(`${member.displayName}님 차단을 해제했습니다.`);
    } catch {
      setStatus("차단 해제 중 오류가 발생했습니다.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="rounded-2xl border border-[#2b281f] bg-[#0f0e0c]/72 p-4">
      <div className="flex items-center gap-2">
        <Ban aria-hidden="true" className="text-[#ff9a9a]" size={18} />
        <h2 className="text-lg font-bold text-[#fffaf1]">차단한 회원</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
        차단한 회원의 게시물은 내 피드에서 보이지 않습니다. 차단을 해제하면 다시
        표시됩니다.
      </p>

      {isLoading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#b8aa95]">
          <Loader2 aria-hidden="true" className="animate-spin" size={16} />
          불러오는 중…
        </div>
      ) : members.length ? (
        <ul className="mt-4 grid gap-2">
          {members.map((member) => (
            <li
              className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#11100e]/60 px-3 py-2.5"
              key={member.id}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#171511] text-[#f3d28a]">
                  <UserRound aria-hidden="true" size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[#fffaf1]">
                    {member.displayName}
                  </span>
                  {member.handle ? (
                    <span className="block truncate text-xs text-[#b8aa95]">
                      @{member.handle}
                    </span>
                  ) : null}
                </span>
              </span>
              <button
                className="shrink-0 rounded-md border border-[#f3d28a]/35 bg-[#2d2414] px-3 py-1.5 text-xs font-bold text-[#f3d28a] transition hover:bg-[#3a2e18] disabled:cursor-not-allowed disabled:opacity-55"
                disabled={busyId === member.id}
                onClick={() => void unblock(member)}
                type="button"
              >
                {busyId === member.id ? (
                  <Loader2 aria-hidden="true" className="animate-spin" size={14} />
                ) : (
                  "차단 해제"
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-white/8 bg-[#11100e]/60 px-3 py-6 text-center text-sm text-[#b8aa95]">
          차단한 회원이 없습니다.
        </p>
      )}

      {status ? (
        <p className="mt-3 text-sm font-semibold text-[#f3d28a]">{status}</p>
      ) : null}
    </section>
  );
}
