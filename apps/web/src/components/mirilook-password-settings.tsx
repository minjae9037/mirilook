"use client";

import { KeyRound, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

// Supabase 기본 최소 길이. 더 올리려면 Supabase Auth 설정과 함께 바꿔야 한다.
const MIN_PASSWORD_LENGTH = 6;

export function MirilookPasswordSettings() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState("");
  // SNS(OAuth)로만 가입한 계정은 비밀번호가 아예 없다 → "변경"이 아니라 "설정"이다.
  const [hasPassword, setHasPassword] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"error" | "info" | "success">("info");

  useEffect(() => {
    // 이펙트 본문에서 동기적으로 setState하면 안 된다(react-hooks/set-state-in-effect).
    // Supabase 미설정은 상태가 아니라 아래 isReady 파생값으로 처리한다.
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) {
        return;
      }

      const user = data.user;

      if (user) {
        setEmail(user.email ?? "");
        // identities에 email provider가 있으면 비밀번호를 이미 쓰는 계정이다.
        const providers = (user.identities ?? []).map((identity) => identity.provider);
        setHasPassword(providers.includes("email"));
      }

      setIsLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, [supabase]);

  // Supabase가 없으면 기다릴 것도 없다 → 곧바로 준비 완료로 보고 email이 비어 렌더되지 않는다.
  const isReady = !supabase || isLoaded;

  async function savePassword() {
    if (!supabase) {
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setStatusTone("error");
      setStatus(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`);
      return;
    }

    if (password !== confirmPassword) {
      setStatusTone("error");
      setStatus("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsSaving(true);
    setStatusTone("info");
    setStatus("비밀번호를 저장하는 중입니다.");

    try {
      const result = await supabase.auth.updateUser({ password });

      if (result.error) {
        setStatusTone("error");
        setStatus(result.error.message || "비밀번호를 저장하지 못했습니다.");
        return;
      }

      setStatusTone("success");
      setStatus(
        hasPassword
          ? "비밀번호를 변경했습니다."
          : "비밀번호를 설정했습니다. 이제 이메일과 비밀번호로도 로그인할 수 있습니다.",
      );
      setHasPassword(true);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setStatusTone("error");
      setStatus(
        error instanceof Error ? error.message : "비밀번호를 저장하지 못했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!isReady) {
    return (
      <section className="rounded-lg border border-white/12 bg-[#171511]/92 p-5">
        <p className="text-sm text-[#b8aa95]">계정 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <section className="grid min-w-0 grid-cols-1 gap-4 rounded-lg border border-white/12 bg-[#171511]/92 p-4 shadow-2xl shadow-black/40 backdrop-blur md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound aria-hidden="true" className="text-[#f3d28a]" size={20} />
            <h2 className="text-xl font-semibold text-[#fffaf1]">
              {hasPassword ? "비밀번호 변경" : "비밀번호 설정"}
            </h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#b8aa95]">
            {hasPassword
              ? "이메일 로그인에 사용할 비밀번호를 변경합니다."
              : "카카오·구글·네이버로 가입한 계정입니다. 비밀번호를 설정하면 소셜 로그인과 이메일 로그인을 모두 쓸 수 있습니다."}
          </p>
        </div>
        <p className="rounded-md border border-[#c9a96a]/35 bg-[#201a12]/80 px-3 py-2 text-sm font-semibold text-[#f3d28a]">
          {email}
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 md:max-w-md">
        <label className="grid min-w-0 gap-1 text-sm font-semibold text-[#e7dccb]">
          새 비밀번호
          <input
            autoComplete="new-password"
            className="h-11 w-full min-w-0 rounded-md border border-white/10 bg-[#11100e] px-3 text-sm text-[#fffaf1] outline-none transition placeholder:text-[#8f826f] focus:border-[#f3d28a]/70"
            onChange={(event) => setPassword(event.target.value)}
            placeholder={`${MIN_PASSWORD_LENGTH}자 이상`}
            type="password"
            value={password}
          />
        </label>
        <label className="grid min-w-0 gap-1 text-sm font-semibold text-[#e7dccb]">
          새 비밀번호 확인
          <input
            autoComplete="new-password"
            className="h-11 w-full min-w-0 rounded-md border border-white/10 bg-[#11100e] px-3 text-sm text-[#fffaf1] outline-none transition placeholder:text-[#8f826f] focus:border-[#f3d28a]/70"
            onChange={(event) => setConfirmPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void savePassword();
              }
            }}
            placeholder="한 번 더 입력"
            type="password"
            value={confirmPassword}
          />
        </label>

        <button
          className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-[#f3d28a] px-4 text-sm font-bold text-[#1a1712] transition hover:bg-[#ffdf98] disabled:cursor-not-allowed disabled:bg-[#675737] disabled:text-[#b8aa95]"
          disabled={isSaving}
          onClick={() => void savePassword()}
          type="button"
        >
          {isSaving ? (
            <Loader2 aria-hidden="true" className="animate-spin" size={16} />
          ) : (
            <KeyRound aria-hidden="true" size={16} />
          )}
          {hasPassword ? "비밀번호 변경" : "비밀번호 설정"}
        </button>

        {status ? (
          <p
            className={`rounded-md border px-3 py-2 text-sm leading-6 ${
              statusTone === "error"
                ? "border-[#ff8f8f]/40 bg-[#3a1c1c]/60 text-[#ffb3a6]"
                : statusTone === "success"
                  ? "border-[#b7e3bb]/40 bg-[#17351f]/60 text-[#b7e3bb]"
                  : "border-white/10 bg-[#0f0e0c]/72 text-[#b8aa95]"
            }`}
          >
            {status}
          </p>
        ) : null}
      </div>
    </section>
  );
}
