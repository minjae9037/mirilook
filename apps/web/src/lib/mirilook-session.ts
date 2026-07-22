"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

// 로그인 여부에 따라 화면을 가르는 곳이 두 군데 이상이라(하단 내비, 스튜디오 맛보기)
// 같은 판정을 한 곳에서 한다.
//
//   unknown — 세션 확인 전. 아직 아무것도 단정하면 안 된다. 게이트 UI와 정상 UI가
//             번갈아 번쩍이는 걸 막으려면 이 상태에서 둘 다 그리지 않아야 한다.
//   authed  — 로그인됨.
//   gated   — 미로그인. 게이트를 걸어야 한다.
//   demo    — Supabase 미설정(로컬 개발). 로그인 여부를 알 방법이 없으므로 게이트를
//             걸면 아무것도 못 보게 된다. 게이트 없이 통과시킨다.
export type MirilookSessionStatus = "unknown" | "authed" | "gated" | "demo";

export function useMirilookSession(): MirilookSessionStatus {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<MirilookSessionStatus>(() =>
    supabase ? "unknown" : "demo",
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setStatus(data.user ? "authed" : "gated");
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session?.user ? "authed" : "gated");
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  return status;
}
