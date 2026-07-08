# 미리룩 모바일 (Capacitor 하이브리드 리모트 래퍼)

라이브 웹(https://mirilook.com)을 네이티브 셸로 감싸고, 네이티브 **카메라 + 푸시 알림** 플러그인을 얹은
국가별 빌드 플레이버 구조입니다. 웹은 Vercel에서 그대로 서비스되고, 앱은 `server.url`로 그 사이트를 로드합니다
(단순 웹뷰가 아니라 네이티브 플러그인이 결합되어 Apple 가이드라인 4.2 대응).

## 구조

```
apps/mobile/
├── capacitor.config.ts        # MIRILOOK_COUNTRY 환경변수로 국가별 appId/appName 결정 (기본 kr)
├── config/
│   ├── shared.json            # 공통 설정 (웹 URL, 번들ID prefix, 기본 AI 백엔드)
│   └── countries/
│       ├── kr.json            # 한국  com.mirilook.app  (포트원 결제)
│       ├── jp.json            # 일본  com.mirilook.jp   (스토어 IAP)
│       ├── us.json            # 미국  com.mirilook.us   (스토어 IAP)
│       └── cn.json            # 중국  com.mirilook.cn   ⚠️ enabled:false (아래 참고)
├── assets/                    # @capacitor/assets 소스 (icon-only/foreground/background, splash, splash-dark)
├── scripts/build-country.mjs  # 국가별 빌드 드라이버 (비활성 국가 차단 + .env.build 생성 + cap sync)
├── shell/index.html           # 원격 사이트 로드 전 잠깐 보이는 로딩 스플래시
├── android/                   # npx cap add android 로 생성
└── ios/                       # npx cap add ios 로 생성 (빌드는 macOS 필요)
```

## 0. 설치

레포 루트(D:/Codex/mirilook)에서:

```bash
npm install
```

## 1. 네이티브 프로젝트 생성 (최초 1회)

apps/mobile에서:

```bash
npx cap add android
npx cap add ios      # 폴더 생성은 Windows에서도 가능, "빌드"는 macOS 필요
```

## 2. 국가별 빌드 준비

레포 루트에서:

```bash
npm run mobile:build -- --country=kr   # 또는 jp / us
```

또는 apps/mobile에서:

```bash
npm run build:country -- --country=kr
```

이 스크립트가 하는 일:
1. `config/shared.json` + `config/countries/<국가>.json` 병합
2. `enabled: false`면 blocker 목록 출력 후 **중단** (cn이 여기 해당)
3. 해석된 appId / appName / locale 출력
4. `apps/mobile/.env.build`에 값 기록 (네이티브 빌드 단계에서 참조)
5. `MIRILOOK_COUNTRY`를 실어 `cap sync` 실행 → capacitor.config.ts가 같은 국가로 동작

## 3. 빌드는 클라우드가 기본 — Codemagic (레포 루트 `codemagic.yaml`)

**이 Windows 머신에는 JDK / Android SDK / Xcode가 없고, 없어도 됩니다.**
레포 루트의 `codemagic.yaml`이 클라우드에서 **Android AAB + iOS IPA를 둘 다** 빌드합니다.

| 워크플로 | 클라우드 머신 | 산출물 | 배포 |
|---|---|---|---|
| `android-kr` | linux_x2 (JDK/SDK 내장) | `.aab` (bundleKrRelease) | Google Play (`google_play` 그룹) |
| `ios-release` | **mac_mini_m2** (Codemagic 클라우드 Mac, Xcode 내장) | `.ipa` | TestFlight (`app_store_credentials` 그룹) |

### iOS에 대한 오해 정리 (중요)

다음 두 문장은 **둘 다 참**이고 서로 모순이 아닙니다:

1. **"이 Windows PC에서 iOS를 로컬 빌드할 수는 없다"** — Xcode는 macOS 전용이라 맞는 말입니다.
2. **"그래도 Windows에서 iOS 출시가 가능하다"** — Codemagic이 클라우드에 macOS 빌드 머신(mac_mini_m2)을
   제공하므로, git push만 하면 클라우드 Mac이 빌드·서명·TestFlight 업로드까지 대신 해 줍니다.
   **Mac을 살 필요가 없습니다.**

iOS의 유일한 필수 조건은 **Apple Developer Program 멤버십(연 $99)** 입니다(서명·배포 권한 때문).
기기 테스트 없이 시뮬레이터 확인이 필요하면 TestFlight 빌드를 실기기 아이폰에 설치해 확인하면 됩니다.

### 계정 셋업 체크리스트 (순서대로)

1. **GitHub 레포** — 이미 완료: `minjae9037/mirilook` (이 모노레포).
2. **Codemagic 가입/연결** — https://codemagic.io 접속 → "Sign up with GitHub" → 팀/개인 워크스페이스 생성 →
   **Add application** → GitHub에서 `minjae9037/mirilook` 선택 → 프로젝트 타입은 자동 감지되며,
   루트의 `codemagic.yaml`을 자동으로 읽어 `android-kr` / `ios-release` 두 워크플로가 나타납니다.
3. **Apple 쪽 (iOS)**
   1. https://developer.apple.com/programs/ 에서 Apple Developer Program 등록(연 $99, 개인 또는 법인).
   2. https://appstoreconnect.apple.com → **사용자 및 액세스 > 통합(Integrations) > App Store Connect API** →
      키 생성(권한 App Manager 이상) → `.p8` 파일 다운로드(1회만 가능, 안전 보관) +
      화면의 **Issuer ID**·**Key ID**를 메모.
   3. Codemagic 콘솔 → 앱 선택 → **Environment variables** 탭 → 그룹명 `app_store_credentials`로 4개 등록
      (전부 Secret 체크):
      - `APP_STORE_CONNECT_ISSUER_ID` = Issuer ID
      - `APP_STORE_CONNECT_KEY_IDENTIFIER` = Key ID
      - `APP_STORE_CONNECT_PRIVATE_KEY` = `.p8` 파일 내용 전체(텍스트로 붙여넣기)
      - `CERTIFICATE_PRIVATE_KEY` = 배포 인증서용 RSA 개인키(PEM). 없으면
        `openssl genrsa -out cert_key.pem 2048`로 생성해 그 내용을 붙여넣으면
        Codemagic이 이 키로 인증서를 자동 발급합니다.
4. **Google 쪽 (Android)**
   1. https://play.google.com/console 개발자 등록(1회 $25).
   2. Play Console → **설정 > API 액세스** → Google Cloud 프로젝트 연결 → 서비스 계정 생성 →
      JSON 키 다운로드 → Play Console에서 해당 서비스 계정에 "출시 관리" 권한 부여.
   3. Codemagic → Environment variables → 그룹명 `google_play`로
      `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` = JSON 파일 내용 전체(Secret 체크) 등록.
      업로드 키스토어도 Codemagic **Code signing identities**에 업로드(분실 금지 — 백업 필수).
5. **앱 레코드 생성** — App Store Connect와 Play Console 양쪽에 번들ID/패키지명
   `com.mirilook.app`(kr)으로 앱을 만들어 둡니다(최초 업로드 후 변경 불가).
   - kr: `com.mirilook.app`, 스토어명 "미리룩", ko-KR
   - jp: `com.mirilook.jp`, "ミリルック", ja-JP
   - us: `com.mirilook.us`, "Mirilook", en-US
6. **빌드 실행** — Codemagic에서 워크플로 선택 → **Start new build** (또는 git push 트리거).
   성공하면 `android-kr`은 AAB를 Play 내부 테스트 트랙에, `ios-release`는 IPA를 TestFlight에 올립니다.

### 국가별 전환

- **Android**: `android/app/build.gradle`에 productFlavors `kr`/`jp`/`us`가 이미 구성되어
  applicationId가 자동 전환됩니다 — `./gradlew bundleKrRelease | bundleJpRelease | bundleUsRelease`.
  Codemagic에서 jp/us를 빌드하려면 `codemagic.yaml`의 `android-kr` 블록을 복사해
  국가값 4곳(워크플로명·MIRILOOK_COUNTRY·PACKAGE_NAME·gradlew 태스크)만 바꾸면 됩니다.
- **iOS**: 현재는 `com.mirilook.app` 단일 번들ID입니다. jp/us는 나중에 Xcode 프로젝트에
  국가별 스킴/타깃(번들ID `com.mirilook.jp`/`com.mirilook.us`)을 추가한 뒤 워크플로를 복제하세요.

### (참고) 로컬 빌드 — 툴체인이 있는 머신에서만

1. `npm run build:country -- --country=kr` (jp/us도 동일)
2. Android: Android Studio(`npx cap open android`) → **Build > Generate Signed Bundle** → 플레이버 선택(krRelease 등)
3. iOS: macOS에서 `npx cap open ios` → Xcode Signing 설정 → Product > Archive

Apple 4.2(최소 기능) 대응: 이 앱은 단순 웹뷰가 아니라 네이티브 카메라 촬영 + 푸시 알림이 결합된 하이브리드입니다. 심사 노트에 이 점을 명시하세요.

## 4. 중국(cn) — 현재 비활성 (enabled: false)

`node scripts/build-country.mjs --country=cn`은 의도적으로 실패합니다. 해제 전 필요한 것:

| Blocker | 내용 |
|---|---|
| google-play-unavailable-in-china | 구글플레이가 중국에서 미운영 → 화웨이 AppGallery / 샤오미 / 텐센트 MyApp 등 현지 안드로이드 스토어별 개별 등록 필요 |
| openai-blocked-needs-domestic-model | OpenAI 접속 차단 → 중국 내 합법 생성형 모델(예: 현지 승인 모델)로 AI 엔진 교체 필요 (`aiBackend: TODO-domestic-model`) |
| icp-license-required | ICP 허가/등록 — 중국 법인(또는 현지 파트너) 명의 필수 |
| pipl-data-localization | PIPL에 따른 개인정보 중국 내 저장(데이터 현지화) 요구 |
| genai-algorithm-filing | 생성형 AI 서비스 알고리즘 비안(备案/등록) 절차 필요 |

결제도 포트원/스토어 IAP가 아닌 알리페이/위챗페이 트랙입니다. 즉 cn은 "설정만 바꾸면 되는 국가"가 아니라
**별도 법인 + 별도 AI 엔진 + 별도 스토어 채널**의 독립 트랙이며, 그 슬롯만 미리 잡아둔 상태입니다.

## 5. 이미 배선된 네이티브 플러그인

- `@capacitor/camera` — 사진 3장 촬영/선택 (네이티브 카메라)
- `@capacitor/push-notifications` — 푸시 알림 (FCM/APNs)
- `@capacitor/app`, `@capacitor/splash-screen` — 생명주기 / 시작 스플래시

웹 쪽(apps/web)은 수정하지 않았습니다. 웹 코드에서 Capacitor 브릿지를 감지해 네이티브 카메라/푸시를 쓰도록 하는
연동은 다음 단계 작업입니다 (`window.Capacitor` 존재 여부로 분기).
