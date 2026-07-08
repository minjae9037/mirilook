# 미리룩 구글 플레이 스토어 — 올리기 직전까지 사전 준비 키트

> 상태: **PG(결제대행사) 연결 완료 대기 중.** 최종 AAB 빌드·업로드는 PG 반영 후 재패키징 시점에 진행.
> 이 문서는 그 직전까지 필요한 모든 것을 미리 준비/검증해 둔 것.

---

## 0. ⚠️ 가장 먼저 결정할 것 — 인앱 결제 방식 (PG 연결과 직결)

**핵심 리스크:** 구글 플레이는 **앱 안에서 파는 "디지털 재화/콘텐츠"는 원칙적으로 구글 플레이 인앱결제(Google Play Billing)를 강제**합니다. 미리룩의 "헤어 머니/크레딧"은 앱 내에서 AI 이미지를 생성하는 **디지털 콘텐츠**라, KG이니시스·PortOne 같은 **외부 PG로 앱 안에서 직접 결제받으면 정책 위반→심사 반려/삭제 리스크**가 있습니다.

지금 연결 중인 PG는 **웹(mirilook.com) 결제엔 문제 없음.** 문제는 **안드로이드 앱 안에서의 결제**입니다. 선택지:

| 방식 | 내용 | 수수료 | 판정 |
|---|---|---|---|
| **A. 구글 플레이 인앱결제** | 공식 Google Play Billing 연동 | 15~30% | 가장 안전·전세계 동일 |
| **B. 한국 제3자 결제** | 외부 PG + 구글 "대체결제 API" 연동(한국만) | 구글 수수료 -4%p | 한국 특례법 기반, 연동 복잡 |
| **C. 실물 서비스 프레이밍** | 크레딧을 "오프라인 미용실 상담 서비스"용으로 규정 | PG만 | 회색지대(미용실 연결이 실서비스면 인앱결제 면제 가능) |
| **D. 앱 내 미판매** | 앱에선 결제 안 받고 웹에서만 | 없음 | 구글이 "외부결제 유도"도 제한 → 주의 |

**✅ 결정(2026-07-08 확정): 합법 하이브리드 (넷플릭스 모델).**
```
· 안드로이드 앱   → 구글 인앱결제(15%)로 크레딧 구매
· 웹 mirilook.com → 자체 PG(연결 중)로 구매 (플랫폼 수수료 0%)
· 둘 다 같은 Supabase 크레딧 잔액에 적립 → 어디서 사든 앱에서 사용
```
**철칙(안티-스티어링):** 앱은 "웹에서 더 싸게" 같은 **안내·링크·가격비교를 절대 노출하지 않는다.** 웹에서 산 크레딧을 앱에서 "쓰는" 것은 합법(제약은 '구매 흐름'에만 적용). 상세 설계는 [`BILLING_HYBRID_SPEC.md`](./BILLING_HYBRID_SPEC.md).

> 앱=mirilook.com 로드 구조라, 웹 결제 UI가 앱에도 뜸 → **Capacitor 감지로 앱에선 구글결제로 전환 + 웹 PG/유도문구 숨김**이 핵심. v1은 이 A안으로만 출시(실서비스 면제 C안은 후속 별도 타진).

---

## 1. 앱 기본 정보 (Play Console에 입력)

| 항목 | 값 |
|---|---|
| 앱 이름 | 미리룩 (Mirilook) |
| 패키지명(applicationId) | `com.mirilook.app` |
| 기본 언어 | 한국어 (ko-KR) |
| 앱/게임 | 앱 |
| 무료/유료 | 무료(앱 다운로드) + 인앱 크레딧 |
| 카테고리 | 뷰티 |
| versionCode / versionName | `1` / `1.0` (재패키징 시 versionCode 정수 +1) |
| minSdk / targetSdk | 24 / 36 (플레이 최신 요건 충족) |

---

## 2. 스토어 등록정보 텍스트 (복붙용)

### 🇰🇷 한국어
- **앱 이름(30자)**: 미리룩 - AI 헤어스타일 추천
- **간단한 설명(80자)**: 사진 한 장으로 내 얼굴에 어울리는 헤어스타일을 AI가 추천하고, 9각도 미리보기로 확인하세요.
- **자세한 설명(4000자)**:
```
미리룩은 내 얼굴에 어울리는 헤어스타일을 AI로 미리 확인하는 앱입니다.

■ 이렇게 사용하세요
1. 내 사진을 올립니다.
2. AI가 얼굴형에 맞는 헤어스타일을 추천합니다.
3. 추천 스타일을 9개 각도로 미리 확인합니다.
4. 마음에 드는 스타일을 미용사에게 그대로 보여주세요.

■ 이런 분께 좋아요
- 미용실 가기 전에 어떤 스타일이 어울릴지 미리 보고 싶은 분
- 원하는 스타일을 미용사에게 정확히 전달하고 싶은 분
- 새로운 헤어스타일에 도전하고 싶은 분

■ 개인정보 보호
업로드한 사진은 헤어스타일 추천 목적에만 사용되며, 관련 법령에 따라 안전하게 관리됩니다.
```

### 🇺🇸 English
- **Title(30)**: Mirilook - AI Hairstyle Preview
- **Short(80)**: Upload one photo and let AI recommend hairstyles that suit your face, in 9 angles.
- **Full**:
```
Mirilook helps you preview hairstyles that suit your face using AI, before you visit the salon.

How it works
1. Upload your photo.
2. AI recommends hairstyles for your face shape.
3. Preview each style from 9 angles.
4. Show the result to your stylist as a clear reference.

Great for
- Anyone who wants to see what suits them before a haircut
- Communicating exactly what you want to your stylist
- Trying a bold new look with confidence

Privacy
Photos you upload are used only to generate hairstyle recommendations and are handled securely.
```

### 🇯🇵 日本語
- **タイトル(30)**: ミリルック - AIヘアスタイル提案
- **簡単な説明(80)**: 写真1枚で、あなたの顔に似合うヘアスタイルをAIが提案。9アングルで確認できます。
- **詳細**: (한국어판을 번역해 사용 — 앱 내 i18n ja 사전과 톤 일치)

---

## 3. 그래픽 자산 (검증 완료 — 경로 그대로 업로드)

| 자산 | 요건 | 준비된 파일 | 상태 |
|---|---|---|---|
| 앱 아이콘 | 512×512 PNG | `apps/web/public/brand/mirilook-icon-512.png` | ✅ 512×512 |
| 피처 그래픽 | 1024×500 PNG | `apps/web/public/store/google-play-feature-1024x500.png` | ✅ 1024×500 |
| 휴대폰 스크린샷 | 2~8장, 16:9/9:16 | `store-assets/playstore/screenshot-1~6.png` | ✅ 6장 1080×1920 |

> 앱 내 아이콘/스플래시(런처 아이콘)는 `@capacitor/assets`로 이미 생성됨(Android 74 파일).

---

## 4. 앱 콘텐츠 / 정책 신고 (Play Console "앱 콘텐츠" 섹션)

### 개인정보처리방침 URL
- **`https://mirilook.com/privacy`** (라이브 확인됨). 환불: `/refund`, 약관: `/terms`, 사업자정보: `/company`.

### 데이터 보안(Data Safety) 폼 — 신고할 내용
- **수집·공유 데이터**:
  - 사진(얼굴 이미지) — **수집함**. 목적: 앱 기능(헤어 추천 생성). 필수. 공유 안 함. → ※ 얼굴 이미지는 민감정보로 취급, "사용자가 삭제 요청 가능" 체크.
  - 이메일/계정 — 수집함(회원가입/소셜로그인). 목적: 계정 관리.
  - 결제 정보 — 결제대행사(PG)가 처리, 앱은 카드정보 직접 수집 안 함.
  - 앱 사용/진단(Sentry) — 수집함. 목적: 분석/오류진단.
- **전송 중 암호화**: 예(HTTPS).
- **삭제 요청 경로**: 계정 삭제/문의 기능 제공.

### 콘텐츠 등급(설문) 예상 답변
- 폭력/성적/도박/약물: 전부 없음 → **전체 이용가(Everyone)** 예상.
- 사용자 생성 콘텐츠(사진 업로드): 있음(본인 사진). 공개 공유 기능(커뮤니티) 있으면 "사용자 상호작용" 체크.

### 대상 연령·광고
- 대상 연령층: 만 13세 이상(어린이 타깃 아님).
- **광고 포함 여부**: 현재 앱 자체 광고 없음 → "광고 없음"(웹 애드센스와 별개, 앱 빌드엔 미포함 확인 필요).

### 기타 선언
- 뉴스 앱 아님 / 코로나19 앱 아님 / 정부 앱 아님.
- 데이터 접근 권한: 카메라·저장소(사진 업로드용) — 매니페스트에 사유 명시.

---

## 5. 서명(Signing) 계획

- **Play 앱 서명(Play App Signing) 사용**(권장): 구글이 최종 서명키를 관리. 대표님은 **업로드 키**만 관리.
- 업로드 키(keystore) 생성은 **이 PC에 JDK/keytool이 없어 로컬 불가** → 두 경로 중 택1:
  1. **Codemagic이 자동 관리**(권장): CI에서 키 생성·보관. 별도 keytool 불필요.
  2. JDK 설치 후 `keytool -genkey -v -keystore mirilook-upload.jks -keyalg RSA -keysize 2048 -validity 9125 -alias mirilook` 로 직접 생성 → **비밀번호는 대표님만 보관(분실 시 앱 업데이트 영구 불가)**.

---

## 6. Play Console 계정 (대표님 직접 — 제가 화면 단위 안내)

1. https://play.google.com/console → 구글 계정 로그인.
2. **개발자 등록비 $25**(1회) 결제.
3. 계정 유형: **조직/사업자**(엠제이인사이트 주식회사, 사업자 226-81-56027) 권장 — D-U-N-S 번호 필요할 수 있음(발급 무료, 수일 소요).
4. 앱 만들기 → 이름 "미리룩", 언어 한국어, 앱/무료 선택.
5. 위 2~4장 텍스트·자산·정책 순서대로 입력(대부분 이미 준비됨).
6. **여기서 멈춤** — AAB 업로드는 PG 결정·재패키징 후.

---

## 7. 최종 런북 (PG 연결 완료된 뒤 실행)

```
① [0번] 인앱 결제 방식 확정 (A 구글결제 / C 실서비스 프레이밍 중 택1) — 저와 함께 결정
② 결제 방식에 맞게 앱 결제 흐름 반영 + 재패키징
③ versionCode 정수 +1 (예: 1 → 2), versionName 조정
④ Codemagic로 android-kr 워크플로 실행 → 서명된 AAB 산출 (로컬 JDK/SDK 불필요)
⑤ Play Console → 프로덕션(또는 내부테스트) 트랙에 AAB 업로드
⑥ 데이터보안·콘텐츠등급·타깃연령 폼 제출 → 검토 요청 → 심사(보통 수일)
```

**지금(사전 준비) 완료 상태:** 0번 리스크 명시 / 1~4번 텍스트·자산·정책 초안·검증 / 5번 서명 계획 / 6번 계정 절차. **남은 것은 대표님의 계정 생성 + PG 확정 후 ①~⑥.**
