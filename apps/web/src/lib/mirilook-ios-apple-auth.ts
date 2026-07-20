// iOS 앱(Capacitor 웹뷰) 전용 네이티브 Apple 로그인.
//
// 웹 OAuth(signInWithOAuth)는 Capacitor 웹뷰에서 외부 사파리로 새어나가 세션이 앱으로
// 돌아오지 않는다(App Store Guideline 4 리젝 사유). 그래서 앱에서는 네이티브 Apple 로그인
// 시트(@capacitor-community/apple-sign-in)로 identityToken을 받아, Supabase signInWithIdToken
// 으로 앱 웹뷰 안에서 세션을 만든다.
//
// ⚠️ @capacitor/core 를 import 하지 않는다 — 웹/안드로이드 빌드는 이 패키지에 의존하지 않으므로
// 전역 window.Capacitor 브릿지로만 접근한다(mirilook-native.ts·native-billing.ts 와 동일한 규칙).
//
// nonce 규칙(중요): Apple 에는 rawNonce 의 SHA-256(hex) 을 넘기고, Supabase 에는 rawNonce 를 넘긴다.
// Apple 이 토큰의 nonce 클레임에 우리가 준 값(=해시)을 그대로 담아주고, Supabase 는 rawNonce 를
// 해시해 토큰의 nonce 와 대조하기 때문이다.

type AppleAuthResult = { identityToken: string; rawNonce: string };

type AppleBridge = {
  authorize: (options: {
    clientId: string;
    redirectURI: string;
    scopes: string;
    nonce?: string;
    state?: string;
  }) => Promise<{ response?: { identityToken?: string } }>;
};

function bridge(): AppleBridge | null {
  if (typeof window === "undefined") return null;
  const cap = (
    window as unknown as {
      Capacitor?: { Plugins?: { SignInWithApple?: AppleBridge } };
    }
  ).Capacitor;
  return cap?.Plugins?.SignInWithApple ?? null;
}

export function isIosAppleAuthAvailable(): boolean {
  return !!bridge();
}

function randomNonce(length = 32): string {
  const charset =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += charset[byte % charset.length];
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 사용자가 시트를 취소한 경우인지 판별(에러 메시지를 조용히 넘기기 위해).
export function isAppleCancel(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return /cancel/i.test(msg) || /\b1001\b/.test(msg);
}

export async function signInWithAppleNative(): Promise<AppleAuthResult> {
  const plugin = bridge();
  if (!plugin) throw new Error("apple_auth_unavailable");
  const rawNonce = randomNonce();
  const hashedNonce = await sha256Hex(rawNonce);
  const result = await plugin.authorize({
    // iOS 네이티브 플로우에선 clientId·redirectURI 가 실제로 쓰이지 않지만 플러그인이 요구한다.
    clientId: "com.mirilook.app",
    redirectURI: "https://mirilook.com/login",
    scopes: "email name",
    nonce: hashedNonce,
  });
  const identityToken = result?.response?.identityToken;
  if (!identityToken) throw new Error("apple_no_token");
  return { identityToken, rawNonce };
}
