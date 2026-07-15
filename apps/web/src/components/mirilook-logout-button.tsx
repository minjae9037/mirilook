"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

// 마이페이지 등에서 쓰는 로그아웃 버튼. 모바일에서는 상단 내비 링크가 숨겨져
// 로그아웃 진입점이 없으므로, 로그인 상태일 때만 노출한다.
export function MirilookLogoutButton() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [signedIn, setSignedIn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setSignedIn(Boolean(data.user));
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    if (!supabase || busy) {
      return;
    }

    setBusy(true);
    await fetch("/api/admin-session/", { method: "DELETE" }).catch(() => null);
    await supabase.auth.signOut();
    setBusy(false);
    router.replace("/");
  }

  if (!signedIn) {
    return null;
  }

  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/12 px-4 text-sm font-semibold text-[#e7dccb] transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={busy}
      onClick={() => void signOut()}
      type="button"
    >
      {busy ? (
        <Loader2 aria-hidden="true" className="animate-spin" size={16} />
      ) : (
        <LogOut aria-hidden="true" size={16} />
      )}
      로그아웃
    </button>
  );
}
