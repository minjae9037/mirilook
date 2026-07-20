// 부적절 콘텐츠 자동 필터(App Store Guideline 1.2 UGC 안전장치).
// 게시물/댓글 작성 시 서버에서 호출해, 노골적 욕설·성적·혐오·폭력 표현이 담긴 글을 막는다.
// 완벽한 필터는 아니지만 "부적절 콘텐츠를 걸러내는 방법"이 존재함을 보장하는 1차 방어선이며,
// 신고(자동 숨김)와 차단이 2차 방어선으로 함께 동작한다.

// 정규식 단어 경계가 한글엔 잘 안 맞으므로, 한글은 부분일치, 영문은 단어 경계로 잡는다.
const koreanPatterns: RegExp[] = [
  // 욕설/비속어
  /씨발|시발|씨불|씨빨|시팔|병신|븅신|지랄|좆|존나|개새끼|개새기|새끼야|썅|엿먹|닥쳐|꺼져/,
  // 혐오/차별
  /장애인새끼|틀딱|급식충|한남충|김치녀|된장녀|보슬아치|맘충|정신병자새끼/,
  // 성적 노골 표현
  /섹스|야동|자위|성기|보지|자지|딸딸이|음란|포르노|후장|강간/,
  // 폭력/위협
  /죽여버|죽여줄|칼로|패버|때려죽|자살해|뒤져라|목매/,
];

const englishPatterns: RegExp[] = [
  /\b(fuck|f\*ck|motherfucker|shit|bitch|bastard|asshole|dick|cunt|slut|whore)\b/i,
  /\b(nigger|nigga|faggot|retard|rape|kill yourself|kys)\b/i,
  /\b(porn|sex\s?video|nude\s?pics)\b/i,
];

// 첫 번째로 걸린 카테고리(디버깅/로그용)를 함께 돌려준다.
export function findObjectionableContent(
  text: string | null | undefined,
): { blocked: boolean; match?: string } {
  if (!text || typeof text !== "string") {
    return { blocked: false };
  }

  const normalized = text.normalize("NFKC");

  for (const pattern of [...koreanPatterns, ...englishPatterns]) {
    const hit = normalized.match(pattern);
    if (hit) {
      return { blocked: true, match: hit[0] };
    }
  }

  return { blocked: false };
}

export function isObjectionableContent(text: string | null | undefined): boolean {
  return findObjectionableContent(text).blocked;
}
