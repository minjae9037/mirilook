// 스튜디오 위저드 단계 모델 — 각 단계는 /studio/<step> 개별 URL.
// 상태는 /studio/layout.tsx가 스튜디오를 지속 마운트해 단계 이동에도 유지된다.

export const STUDIO_STEPS = [
  "gender", // (1) 남성/여성 선택
  "consent", // (2) 얼굴 사진 AI 사용 동의
  "photos", // (3) 사진 3장 올리기 / 내 사진 불러오기
  "style", // (4) 추천 목적 · 스타일 선택
  "color", // (5) 원하는 헤어 컬러
  "notes", // (6) 원하는 느낌 메모 · 연예인 헤어 레퍼런스
  "summary", // (7) 2~6 요약 + 스타일 추천 받기
  "recommend", // (8) 스타일 9개 추천 + 코멘트 + 상담/코디 버튼
  "consult", // (9-1) 상담용 9장 결과
  "outfit", // (9-2) 코디 추천 결과
] as const;

export type StudioStep = (typeof STUDIO_STEPS)[number];

export const STUDIO_FIRST_STEP: StudioStep = STUDIO_STEPS[0];

// 상단 진행바에 표시할 입력 단계. 결과 단계(recommend~outfit)는 진행바 밖.
export const STUDIO_PROGRESS: Array<{ key: StudioStep; label: string }> = [
  { key: "gender", label: "성별" },
  { key: "consent", label: "동의" },
  { key: "photos", label: "사진" },
  { key: "style", label: "스타일" },
  { key: "color", label: "컬러" },
  { key: "notes", label: "메모" },
  { key: "summary", label: "요약" },
];

export const STUDIO_STEP_LABEL: Record<StudioStep, string> = {
  gender: "추천 서비스 선택",
  consent: "사진 사용 동의",
  photos: "사진 올리기",
  style: "추천 목적 · 스타일",
  color: "원하는 헤어 컬러",
  notes: "느낌 메모 · 레퍼런스",
  summary: "요약 · 추천 받기",
  recommend: "스타일 추천 결과",
  consult: "상담용 9장",
  outfit: "코디 추천",
};

export function stepFromPathname(pathname: string | null | undefined): StudioStep {
  if (!pathname) return STUDIO_FIRST_STEP;
  const seg = pathname.split("/").filter(Boolean)[1]; // /studio/<seg>
  return (STUDIO_STEPS as readonly string[]).includes(seg ?? "")
    ? (seg as StudioStep)
    : STUDIO_FIRST_STEP;
}

export function stepIndex(step: StudioStep): number {
  return STUDIO_STEPS.indexOf(step);
}

export function stepHref(step: StudioStep): string {
  return `/studio/${step}`;
}

// 앞 단계(입력 단계 gender~summary)에서 이전/다음 순차 이동에 쓰는 헬퍼.
export function prevStep(step: StudioStep): StudioStep | null {
  const i = stepIndex(step);
  return i > 0 ? STUDIO_STEPS[i - 1] : null;
}

export function nextStep(step: StudioStep): StudioStep | null {
  const i = stepIndex(step);
  return i >= 0 && i < STUDIO_STEPS.length - 1 ? STUDIO_STEPS[i + 1] : null;
}

// 앞 단계로 되돌아가도 잃을 게 없는 구간(성별·동의)과, 새로고침 시 사진·생성물이
// 날아가는 구간을 구분한다. 이탈 확인창은 후자에서만 띄운다.
export function shouldGuardStudioRefresh(step: StudioStep): boolean {
  return stepIndex(step) >= stepIndex("photos");
}
