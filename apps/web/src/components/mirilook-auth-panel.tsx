"use client";

import type { AuthUser } from "@supabase/supabase-js";
import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getMirilookAppPlatform,
  useIsMirilookApp,
} from "@/lib/mirilook-native";
import {
  isAppleCancel,
  isIosAppleAuthAvailable,
  signInWithAppleNative,
} from "@/lib/mirilook-ios-apple-auth";
import {
  getAuthRedirectUrl,
  getOAuthRedirectUrl,
  getSupabaseBrowserClient,
  getUserDisplayName,
  isNaverLoginEnabled,
  startNaverLogin,
} from "@/lib/supabase-browser";

type AuthMode = "login" | "signup";
type StatusTone = "info" | "success" | "error";

export function MirilookAuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const naverEnabled = useMemo(() => isNaverLoginEnabled(), []);
  // iOS 앱(Capacitor 웹뷰)에서는 App Store 4.8 + 웹뷰 제약(구글 disallowed_useragent)
  // 때문에 Apple + 이메일만 노출한다. 웹/안드로이드에선 기존 소셜 로그인을 유지.
  const { isApp } = useIsMirilookApp();
  const isIosApp = isApp && getMirilookAppPlatform() === "ios";
  // ?mode=signup으로 들어오면 회원가입 탭에서 시작한다.
  // 하단 내비의 "회원가입하고 시작하기"가 이 링크를 쓴다.
  const [mode, setMode] = useState<AuthMode>(() =>
    searchParams.get("mode") === "signup" ? "signup" : "login",
  );
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 회원가입 전 약관(무관용 정책 포함) 동의 — App Store Guideline 1.2 필수.
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [status, setStatus] = useState(() =>
    supabase
      ? ""
      : "Supabase URL과 anon key를 연결하면 회원가입/로그인 기능이 활성화됩니다.",
  );
  const [statusTone, setStatusTone] = useState<StatusTone>(supabase ? "info" : "error");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [busyAction, setBusyAction] = useState("");
  // Guard so a fresh sign-in only redirects home once (avoids loops on re-renders).
  const postAuthRedirectedRef = useRef(false);

  const syncProfile = useCallback(
    async (nextUser: AuthUser) => {
      if (!supabase) {
        return;
      }

      const result = await supabase.from("profiles").upsert(
        {
          avatar_url: text(nextUser.user_metadata?.avatar_url),
          display_name: getUserDisplayName(nextUser),
          email: nextUser.email,
          id: nextUser.id,
          provider:
            text(nextUser.app_metadata?.provider) ||
            text(nextUser.user_metadata?.provider) ||
            "email",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      if (result.error) {
        console.warn("profile sync failed", result.error);
      }
    },
    [supabase],
  );

  const signInWithProvider = useCallback(
    async (provider: "google" | "kakao" | "apple") => {
      const providerLabel =
        provider === "google" ? "구글" : provider === "apple" ? "Apple" : "카카오";

      if (!supabase) {
        setStatusTone("error");
        setStatus("Supabase 연결 후 SNS 로그인을 사용할 수 있습니다.");
        return;
      }

      if (mode === "signup" && !agreedToTerms) {
        setStatusTone("error");
        setStatus("회원가입을 진행하려면 이용약관 동의에 체크해 주세요.");
        return;
      }

      // iOS 앱: 웹 OAuth는 외부 사파리로 새어 세션이 앱에 안 돌아온다(Guideline 4 리젝).
      // 네이티브 Apple 로그인 시트로 identityToken을 받아 앱 웹뷰 안에서 세션을 만든다.
      if (provider === "apple" && isIosApp && isIosAppleAuthAvailable()) {
        setBusyAction("apple");
        setStatusTone("info");
        setStatus("Apple 로그인 창을 여는 중입니다...");

        try {
          const { identityToken, rawNonce } = await signInWithAppleNative();
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "apple",
            token: identityToken,
            nonce: rawNonce,
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            void syncProfile(data.user);
          }

          // signInWithIdToken은 서버 콜백을 거치지 않으므로 여기서 직접 홈으로 보낸다.
          postAuthRedirectedRef.current = true;
          router.replace("/");
        } catch (appleError) {
          setBusyAction("");

          if (isAppleCancel(appleError)) {
            setStatus("");
            return;
          }

          setStatusTone("error");
          setStatus(
            "Apple 로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          );
        }

        return;
      }

      setBusyAction(provider);
      setStatusTone("info");
      setStatus(`${providerLabel} 로그인 창으로 이동합니다...`);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: getOAuthRedirectUrl() },
      });

      if (error) {
        setBusyAction("");
        setStatusTone("error");
        setStatus(
          `${providerLabel} 로그인을 시작하지 못했습니다. 관리자에게 ${providerLabel} 로그인 설정을 요청하거나 잠시 후 다시 시도해 주세요.`,
        );
      }
      // On success the browser is redirected to the provider, then back to /login.
    },
    [supabase, isIosApp, syncProfile, router, mode, agreedToTerms],
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) {
        return;
      }

      setUser(data.user);

      if (data.user) {
        void syncProfile(data.user);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        void syncProfile(session.user);

        // After OAuth (Google/Kakao) the browser returns to /login and fires
        // SIGNED_IN once the session is established — send the user to the home
        // screen rather than leaving them on the login page. INITIAL_SESSION
        // (a normal page load while already logged in) is intentionally ignored.
        if (event === "SIGNED_IN" && !postAuthRedirectedRef.current) {
          postAuthRedirectedRef.current = true;
          router.replace("/");
        }
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase, syncProfile, router]);

  // 네이버 커스텀 OAuth 복귀 처리: 콜백이 붙여 보낸 token_hash로 세션을 만든다.
  // 일반 페이지 로드(네이버 파라미터 없음)에서는 아무 일도 하지 않는다.
  useEffect(() => {
    if (!supabase || typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const naverError = params.get("error");
    const tokenHash = params.get("token_hash");
    const type = params.get("type");

    if (!naverError && (!tokenHash || type !== "magiclink")) {
      return;
    }

    const clearAuthParams = () => {
      ["token_hash", "type", "provider", "error"].forEach((key) =>
        params.delete(key),
      );
      const query = params.toString();
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}`,
      );
    };

    void (async () => {
      if (naverError) {
        setStatusTone("error");
        setStatus(`네이버 로그인에 실패했습니다: ${naverError}`);
        clearAuthParams();
        return;
      }

      setBusyAction("naver");
      setStatusTone("info");
      setStatus("네이버 로그인을 마무리하는 중입니다...");

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash as string,
        type: "magiclink",
      });
      clearAuthParams();

      if (error) {
        setBusyAction("");
        setStatusTone("error");
        setStatus(
          "네이버 로그인 세션 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
        return;
      }

      if (data.user) {
        setUser(data.user);
        await syncProfile(data.user);
      }

      postAuthRedirectedRef.current = true;
      router.replace("/");
    })();
  }, [router, supabase, syncProfile]);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setStatusTone("error");
      setStatus("로그인 서버가 아직 연결되지 않았습니다. Supabase 환경변수를 먼저 설정해 주세요.");
      return;
    }

    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatusTone("error");
      setStatus("이메일 주소를 정확히 입력해 주세요.");
      return;
    }

    if (password.length < 6) {
      setStatusTone("error");
      setStatus("비밀번호는 최소 6자 이상으로 입력해 주세요.");
      return;
    }

    if (mode === "signup" && !agreedToTerms) {
      setStatusTone("error");
      setStatus("회원가입을 진행하려면 이용약관 동의에 체크해 주세요.");
      return;
    }

    setBusyAction(mode);
    setStatusTone("info");
    setStatus(mode === "signup" ? "회원가입을 처리하는 중입니다." : "로그인 중입니다.");

    try {
      const result =
        mode === "signup"
          ? await supabase.auth.signUp({
              email: normalizedEmail,
              options: {
                data: {
                  full_name: displayName.trim() || undefined,
                },
                emailRedirectTo: getAuthRedirectUrl(),
              },
              password,
            })
          : await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password,
            });

      if (result.error) {
        setStatusTone("error");
        setStatus(getReadableAuthMessage(result.error.message, mode));
        return;
      }

      const sessionUser = result.data.session?.user ?? null;

      if (sessionUser) {
        setUser(sessionUser);
        setStatusTone("success");
        setStatus(
          mode === "signup"
            ? "회원가입과 로그인이 완료되었습니다. 홈으로 이동합니다."
            : "로그인되었습니다. 홈으로 이동합니다.",
        );
        postAuthRedirectedRef.current = true;
        router.replace("/");
        return;
      }

      if (mode === "signup") {
        setUser(null);
        setMode("login");
        setPassword("");
        setStatusTone("success");
        setStatus(getSignupFollowUpMessage(result.data.user));
        return;
      }

      setUser(null);
      setStatusTone("error");
      setStatus("로그인 응답을 받았지만 세션을 확인하지 못했습니다. 다시 로그인해 주세요.");
    } catch (error) {
      setStatusTone("error");
      setStatus(getReadableAuthMessage(error, mode));
    } finally {
      setBusyAction("");
    }
  }

  async function sendPasswordReset() {
    if (!supabase) {
      setStatusTone("error");
      setStatus("로그인 서버가 아직 연결되지 않았습니다. Supabase 환경변수를 먼저 설정해 주세요.");
      return;
    }

    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatusTone("error");
      setStatus("비밀번호 재설정 메일을 받을 이메일을 입력해 주세요.");
      return;
    }

    setBusyAction("reset");
    setStatusTone("info");
    setStatus("비밀번호 재설정 메일을 발송하는 중입니다.");

    try {
      const result = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: getAuthRedirectUrl(),
      });

      setStatus(
        result.error
          ? getReadableAuthMessage(result.error.message, "login")
          : "비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해 주세요.",
      );
      setStatusTone(result.error ? "error" : "success");
    } catch (error) {
      setStatusTone("error");
      setStatus(getReadableAuthMessage(error, "login"));
    } finally {
      setBusyAction("");
    }
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    setBusyAction("signout");
    await fetch("/api/admin-session/", { method: "DELETE" }).catch(() => null);
    const result = await supabase.auth.signOut();
    setBusyAction("");

    if (result.error) {
      setStatusTone("error");
      setStatus(getReadableAuthMessage(result.error.message, "login"));
      return;
    }

    setUser(null);
    setStatusTone("success");
    setStatus("로그아웃되었습니다.");
  }

  const actionVerb = mode === "login" ? "로그인" : "시작하기";

  return (
    <section className="mx-auto w-full max-w-md">
      {!user ? (
        <div
          className="mx-auto mb-7 flex w-full max-w-[19rem] rounded-2xl p-1"
          style={{ background: "var(--ml-sunken, #f2f4f6)" }}
        >
          {(["signup", "login"] as const).map((item) => {
            const activeTab = mode === item;
            return (
              <button
                className="h-11 flex-1 rounded-xl text-sm font-extrabold transition"
                key={item}
                onClick={() => {
                  setMode(item);
                  setStatus("");
                  setStatusTone("info");
                }}
                style={
                  activeTab
                    ? {
                        background: "linear-gradient(135deg, #fb5c8d, #ea4a7c)",
                        color: "#ffffff",
                        boxShadow: "0 4px 12px rgba(234, 74, 124, 0.22)",
                      }
                    : { color: "var(--ml-muted, #5f6b7a)" }
                }
                type="button"
              >
                {item === "signup" ? "회원가입" : "로그인"}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-col items-center text-center">
        <span
          className="flex size-16 items-center justify-center rounded-2xl text-white"
          style={{
            background: "linear-gradient(135deg, #fb7ba8, #f46b96)",
            boxShadow: "0 8px 18px rgba(234, 74, 124, 0.2)",
          }}
        >
          <Sparkles aria-hidden="true" size={30} />
        </span>
        <h2
          className="mt-4 text-[30px] font-extrabold leading-tight"
          style={{ color: "var(--ml-ink, #191f28)" }}
        >
          {user ? "내 계정" : mode === "login" ? "로그인" : "회원가입"}
        </h2>
        <p
          className="mt-2 text-sm leading-6"
          style={{ color: "var(--ml-muted, #5f6b7a)" }}
        >
          {user
            ? "미리룩 계정으로 추천 히스토리와 상담 기록을 관리하세요."
            : mode === "login"
              ? "로그인하면 추천 히스토리와 상담 기록을 이어서 볼 수 있어요."
              : "가입하면 추천 결과와 상담 이미지를 계정에 저장할 수 있어요."}
        </p>
      </div>

      {status ? <AuthStatusNotice message={status} tone={statusTone} /> : null}

      {user ? (
        <div
          className="mt-6 rounded-2xl p-5 text-center"
          style={{ background: "#fff5f8", border: "1px solid #ffd5e3" }}
        >
          <p className="text-sm font-bold" style={{ color: "#ea4a7c" }}>
            로그인된 계정
          </p>
          <p
            className="mt-2 text-lg font-bold"
            style={{ color: "var(--ml-ink, #191f28)" }}
          >
            {getUserDisplayName(user)}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--ml-muted, #5f6b7a)" }}>
            {user.email ?? "이메일 계정"}
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <a
              className="flex h-12 items-center justify-center gap-2 rounded-xl text-[15px] font-bold text-white transition active:scale-[0.99]"
              href="/mypage"
              style={{ background: "linear-gradient(135deg, #fb5c8d, #ea4a7c)" }}
            >
              <CheckCircle2 aria-hidden="true" size={18} />
              마이페이지 보기
            </a>
            <button
              className="flex h-12 items-center justify-center gap-2 rounded-xl border text-[15px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busyAction === "signout"}
              onClick={() => void signOut()}
              style={{ borderColor: "#e5e7eb", color: "var(--ml-body, #333b47)" }}
              type="button"
            >
              {busyAction === "signout" ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={18} />
              ) : (
                <LogOut aria-hidden="true" size={18} />
              )}
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <>
          {mode === "signup" ? (
            <label
              className="mt-6 flex items-start gap-2.5 rounded-2xl p-3.5 text-left"
              style={{ background: "#fff5f8", border: "1px solid #ffd5e3" }}
            >
              <input
                checked={agreedToTerms}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#ea4a7c]"
                onChange={(event) => setAgreedToTerms(event.target.checked)}
                type="checkbox"
              />
              <span
                className="text-[12.5px] leading-5"
                style={{ color: "#7a4256" }}
              >
                만 14세 이상이며,{" "}
                <a className="font-bold underline" href="/terms">
                  이용약관
                </a>{" "}
                및{" "}
                <a className="font-bold underline" href="/privacy">
                  개인정보처리방침
                </a>
                에 동의합니다. 미리룩 커뮤니티는{" "}
                <b>부적절한 콘텐츠와 괴롭힘·악성 이용자에 대해 무관용</b>이며,
                위반 시 콘텐츠 삭제와 이용 제한이 적용됩니다.
              </span>
            </label>
          ) : (
            <p
              className="mt-6 text-center text-[12px] leading-5"
              style={{ color: "var(--ml-muted, #5f6b7a)" }}
            >
              로그인하면{" "}
              <a className="font-semibold underline" href="/terms">
                이용약관
              </a>
              {" · "}
              <a className="font-semibold underline" href="/privacy">
                개인정보처리방침
              </a>{" "}
              및 커뮤니티 무관용 정책에 동의하게 됩니다.
            </p>
          )}
          <div className="mt-4 grid gap-3">
            {/* Apple 로그인 — iOS 앱에서는 필수(4.8), 웹/안드로이드에서도 선택 제공 */}
            <button
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl px-4 text-[15px] font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busyAction === "apple"}
              onClick={() => void signInWithProvider("apple")}
              style={{ background: "#000000", color: "#ffffff" }}
              type="button"
            >
              {busyAction === "apple" ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={18} />
              ) : (
                <AppleIcon />
              )}
              {`Apple로 ${actionVerb}`}
            </button>

            {/* iOS 앱에서는 구글/카카오/네이버를 숨긴다(웹뷰 제약·4.8). */}
            {!isIosApp ? (
              <>
                <button
                  className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl px-4 text-[15px] font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={busyAction === "kakao"}
                  onClick={() => void signInWithProvider("kakao")}
                  style={{ background: "#fde86b", color: "#3c2e00" }}
                  type="button"
                >
                  {busyAction === "kakao" ? (
                    <Loader2 aria-hidden="true" className="animate-spin" size={18} />
                  ) : (
                    <MessageCircle aria-hidden="true" fill="#3c2e00" size={18} />
                  )}
                  {`카카오로 ${actionVerb}`}
                </button>

                <button
                  className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border px-4 text-[15px] font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={busyAction === "google"}
                  onClick={() => void signInWithProvider("google")}
                  style={{
                    background: "#ffffff",
                    borderColor: "#dadce0",
                    color: "#1f1f1f",
                    boxShadow: "0 1px 3px rgba(60, 64, 67, 0.15)",
                  }}
                  type="button"
                >
                  {busyAction === "google" ? (
                    <Loader2 aria-hidden="true" className="animate-spin" size={18} />
                  ) : (
                    <GoogleGIcon />
                  )}
                  {`Google로 ${actionVerb}`}
                </button>

                {naverEnabled ? (
                  <button
                    className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl px-4 text-[15px] font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={busyAction === "naver"}
                    onClick={() => {
                      setBusyAction("naver");
                      setStatusTone("info");
                      setStatus("네이버 로그인 창으로 이동합니다...");
                      startNaverLogin();
                    }}
                    style={{ background: "#dff3e7", color: "#0a9b4a" }}
                    type="button"
                  >
                    {busyAction === "naver" ? (
                      <Loader2 aria-hidden="true" className="animate-spin" size={18} />
                    ) : (
                      <span className="text-base font-black">N</span>
                    )}
                    {`네이버로 ${actionVerb}`}
                  </button>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="my-6 flex items-center gap-3">
            <span
              className="h-px flex-1"
              style={{ background: "var(--ml-border, rgba(25, 31, 40, 0.12))" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--ml-muted, #5f6b7a)" }}
            >
              {mode === "login" ? "이메일로 로그인" : "이메일로 가입"}
            </span>
            <span
              className="h-px flex-1"
              style={{ background: "var(--ml-border, rgba(25, 31, 40, 0.12))" }}
            />
          </div>

          <form
            className="grid gap-3"
            onSubmit={(event) => void handleEmailSubmit(event)}
          >
            {mode === "signup" ? (
              <label className="grid gap-1.5">
                <span
                  className="text-[13px] font-bold"
                  style={{ color: "var(--ml-ink, #191f28)" }}
                >
                  이름
                </span>
                <input
                  className="h-14 w-full rounded-2xl border border-[#f3c6d6] bg-[#fff5f8] px-4 text-[15px] text-[#191f28] outline-none transition placeholder:text-[#b9899b] focus:border-[#ea4a7c] focus:bg-white"
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="히스토리에 표시할 이름"
                  value={displayName}
                />
              </label>
            ) : null}

            <label className="grid gap-1.5">
              <span
                className="text-[13px] font-bold"
                style={{ color: "var(--ml-ink, #191f28)" }}
              >
                이메일
              </span>
              <input
                className="h-14 w-full rounded-2xl border border-[#f3c6d6] bg-[#fff5f8] px-4 text-[15px] text-[#191f28] outline-none transition placeholder:text-[#b9899b] focus:border-[#ea4a7c] focus:bg-white"
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            </label>

            <label className="grid gap-1.5">
              <span
                className="text-[13px] font-bold"
                style={{ color: "var(--ml-ink, #191f28)" }}
              >
                비밀번호
              </span>
              <input
                className="h-14 w-full rounded-2xl border border-[#f3c6d6] bg-[#fff5f8] px-4 text-[15px] text-[#191f28] outline-none transition placeholder:text-[#b9899b] focus:border-[#ea4a7c] focus:bg-white"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="6자 이상"
                type="password"
                value={password}
              />
            </label>

            {/* 연회색 버튼이라 배경과 거의 붙어 보여 테두리를 넣는다.
                (구글 버튼과 같은 방식 — className에 border, 색은 style에서.) */}
            <button
              className="mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border px-4 text-base font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busyAction === mode}
              style={{
                background: "#f2f4f6",
                borderColor: "#c9d0d8",
                color: "#333d4b",
              }}
              type="submit"
            >
              {busyAction === mode ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={18} />
              ) : (
                <Mail aria-hidden="true" size={18} />
              )}
              {busyAction === mode
                ? mode === "login"
                  ? "로그인 중..."
                  : "가입 처리 중..."
                : mode === "login"
                  ? "이메일로 로그인"
                  : "이메일로 회원가입"}
            </button>

            {mode === "login" ? (
              <button
                className="mx-auto mt-1 text-[13px] font-semibold underline underline-offset-4 transition disabled:cursor-not-allowed disabled:opacity-60"
                disabled={busyAction === "reset"}
                onClick={() => void sendPasswordReset()}
                style={{ color: "var(--ml-muted, #5f6b7a)" }}
                type="button"
              >
                {busyAction === "reset" ? "재설정 메일 발송 중…" : "비밀번호를 잊으셨나요?"}
              </button>
            ) : null}
          </form>
        </>
      )}
    </section>
  );
}

function GoogleGIcon() {
  return (
    <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
      <path
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" height="20" viewBox="0 0 384 512" width="18" fill="#ffffff">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function AuthStatusNotice({
  message,
  tone,
}: {
  message: string;
  tone: StatusTone;
}) {
  const Icon = tone === "error" ? CircleAlert : tone === "success" ? CheckCircle2 : Loader2;
  const toneStyle =
    tone === "error"
      ? { background: "#fdecef", border: "1px solid #f2b8b3", color: "#c0342f" }
      : tone === "success"
        ? { background: "#e8f6ec", border: "1px solid #a9dcbb", color: "#1f7a45" }
        : { background: "#fff5f8", border: "1px solid #f3c6d6", color: "#ea4a7c" };

  return (
    <p
      aria-live="polite"
      className="mt-5 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm leading-6"
      role="status"
      style={toneStyle}
    >
      <Icon
        aria-hidden="true"
        className={tone === "info" ? "mt-0.5 shrink-0 animate-spin" : "mt-0.5 shrink-0"}
        size={16}
      />
      <span>{message}</span>
    </p>
  );
}

function getSignupFollowUpMessage(user: AuthUser | null) {
  if (Array.isArray(user?.identities) && user.identities.length === 0) {
    return "이미 가입된 이메일일 수 있습니다. 로그인 탭에서 같은 이메일과 비밀번호로 로그인해 주세요.";
  }

  return "회원가입이 접수되었습니다. 이메일 인증 메일이 도착했다면 인증을 완료한 뒤 로그인해 주세요.";
}

function getReadableAuthMessage(error: unknown, mode: AuthMode) {
  const raw =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
  const message = raw.toLowerCase();

  if (/invalid login credentials|invalid credentials|email not confirmed/.test(message)) {
    return "이메일 또는 비밀번호가 맞지 않거나 이메일 인증이 아직 완료되지 않았습니다.";
  }

  if (/already registered|user already registered|already exists/.test(message)) {
    return "이미 가입된 이메일입니다. 로그인 탭에서 로그인해 주세요.";
  }

  if (/rate limit|too many|for security purposes/.test(message)) {
    return "요청이 잠시 많았습니다. 1분 뒤 다시 시도해 주세요.";
  }

  if (/failed to fetch|network|fetch/.test(message)) {
    return "로그인 서버 응답이 지연되고 있습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.";
  }

  return mode === "signup"
    ? `회원가입을 완료하지 못했습니다. ${raw}`
    : `로그인을 완료하지 못했습니다. ${raw}`;
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : null;
}
