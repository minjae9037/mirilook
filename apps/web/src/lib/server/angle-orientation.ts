import OpenAI from "openai";

// 상담 9방향에서 좌/우 방향이 뒤집혀 나오던 치명적 오류를 막는 검증·교정 레이어.
//
// 배경: 이미지 생성 모델은 "고객 기준 왼쪽/오른쪽" 같은 이진 지시를 신뢰성 있게
// 지키지 못한다. 게다가 좌상단·우상단(좌측·우측, 좌후면·우후면)은 **같은 참조
// 이미지 + 같은 조건**으로 각각 생성돼, 참조의 방향을 그대로 베껴 두 장이 같은
// 방향으로 나오는 일이 잦았다. 프롬프트만으로는 확률적으로 계속 실패한다.
//
// 그래서 생성 결과를 실제로 "보고" 판정한 뒤 교정한다:
//   생성 → 비전 판정 → (틀리면) 재생성 1회 → 그래도 틀리면 좌우반전 강제.
// 좌우반전은 잘못된 방향의 프로필을 정확히 반대 방향으로 만들어 주므로,
// 방향 오류만큼은 100% 제거된다(비대칭 가르마는 반전되므로 최후 수단으로만 사용).

export type AngleOrientation = "left" | "right" | "front" | "back" | "top" | "unknown";

type AngleRule = {
  // 뷰어 기준 코가 향해야 하는 방향(또는 back/top/front)
  expected: AngleOrientation;
  // 좌우반전으로 교정 가능한 각도인가(프로필·3/4는 가능, 정면·상단·후면은 불가)
  mirrorable: boolean;
  // 이 값들이 나오면 정상으로 인정(3/4 후면처럼 판정이 애매한 슬롯용)
  tolerated: AngleOrientation[];
};

// 앱의 각도 규약(resultAngles 프롬프트와 동일):
//  - 좌측: "Nose points toward viewer right"  → 뷰어 기준 오른쪽
//  - 우측: "Nose points toward viewer left"   → 뷰어 기준 왼쪽
//  - 좌*: 격자 중앙(오른쪽)을 바라봄 / 우*: 격자 중앙(왼쪽)을 바라봄
const angleRules: Record<string, AngleRule> = {
  좌상단: { expected: "right", mirrorable: true, tolerated: [] },
  상단: { expected: "top", mirrorable: false, tolerated: ["unknown"] },
  우상단: { expected: "left", mirrorable: true, tolerated: [] },
  좌측: { expected: "right", mirrorable: true, tolerated: [] },
  정면: { expected: "front", mirrorable: false, tolerated: ["unknown"] },
  우측: { expected: "left", mirrorable: true, tolerated: [] },
  // 후면 3/4는 얼굴이 거의 안 보여 판정이 흔들린다 → back도 정상으로 인정하고,
  // "명백히 반대쪽"일 때만 반전 교정한다.
  좌후면: { expected: "right", mirrorable: true, tolerated: ["back", "unknown"] },
  후면: { expected: "back", mirrorable: false, tolerated: ["unknown"] },
  우후면: { expected: "left", mirrorable: true, tolerated: ["back", "unknown"] },
};

export function getAngleRule(angleLabel: string): AngleRule | null {
  return angleRules[angleLabel] ?? null;
}

const CLASSIFY_SYSTEM = `You are a strict image orientation classifier for a hair salon consultation tool.
Look at the portrait and report ONLY the head orientation as the VIEWER sees it.
Answer with exactly one uppercase word, nothing else:
RIGHT - the face/nose points toward the RIGHT edge of the image (profile or three-quarter turned to viewer right)
LEFT - the face/nose points toward the LEFT edge of the image
FRONT - facing the camera; both eyes and both cheeks visible and roughly symmetric
BACK - back of the head; no face features visible
TOP - photographed from directly above; crown/part line dominates
If the head is turned away but a small edge of one cheek shows, answer RIGHT or LEFT based on which edge that cheek is toward.`;

function parseOrientation(raw: string | null | undefined): AngleOrientation {
  const value = (raw ?? "").trim().toUpperCase();

  if (value.startsWith("RIGHT")) return "right";
  if (value.startsWith("LEFT")) return "left";
  if (value.startsWith("FRONT")) return "front";
  if (value.startsWith("BACK")) return "back";
  if (value.startsWith("TOP")) return "top";

  return "unknown";
}

export async function classifyAngleOrientation(
  imageDataUrl: string,
): Promise<AngleOrientation> {
  if (!process.env.OPENAI_API_KEY) {
    return "unknown";
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 2,
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_ORIENTATION_MODEL ?? "gpt-4.1-mini",
      max_tokens: 5,
      temperature: 0,
      messages: [
        { role: "system", content: CLASSIFY_SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: "Orientation?" },
            { type: "image_url", image_url: { url: imageDataUrl, detail: "low" } },
          ],
        },
      ],
    });

    return parseOrientation(completion.choices?.[0]?.message?.content);
  } catch (error) {
    console.warn("angle orientation classify failed", error);

    return "unknown";
  }
}

// 좌우반전(거울상). 잘못된 방향의 프로필을 정확히 반대 방향으로 만든다.
export async function mirrorImageDataUrl(imageDataUrl: string): Promise<string> {
  const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    return imageDataUrl;
  }

  try {
    // sharp는 Next가 기본으로 서버 외부 패키지로 취급한다(모노레포 루트에 설치됨).
    const { default: sharp } = await import("sharp");
    const flipped = await sharp(Buffer.from(match[2], "base64"))
      .flop()
      .jpeg({ quality: 92 })
      .toBuffer();

    return `data:image/jpeg;base64,${flipped.toString("base64")}`;
  } catch (error) {
    console.warn("angle mirror failed", error);

    return imageDataUrl;
  }
}

function isAcceptable(rule: AngleRule, actual: AngleOrientation) {
  return actual === rule.expected || rule.tolerated.includes(actual);
}

// 반전으로 고칠 수 있는 오류인가(정확히 반대 방향으로 나온 경우)
function isOppositeSide(rule: AngleRule, actual: AngleOrientation) {
  if (!rule.mirrorable) return false;
  if (rule.expected === "right") return actual === "left";
  if (rule.expected === "left") return actual === "right";

  return false;
}

/**
 * 좌우반전은 되돌릴 수 없는 "파괴적" 교정이다. 만약 판정기가 이 이미지에서
 * 좌우를 제대로 못 읽는다면, 멀쩡한 이미지를 뒤집어 오히려 틀리게 만들 수 있다.
 *
 * 그래서 반전 실행 전에 판정기 자체를 런타임 검증한다:
 * 원본과 좌우반전본을 각각 판정했을 때 **반드시 서로 반대**가 나와야 한다.
 * 같게 나오면(=이 이미지에서 좌우를 구분 못 함) 신뢰할 수 없으므로 손대지 않는다.
 * 이 덕분에 "판정기가 틀려서 더 나빠지는" 경우가 구조적으로 차단된다.
 */
async function mirrorIfClassifierIsReliable(
  imageUrl: string,
  actual: AngleOrientation,
): Promise<string | null> {
  const mirrored = await mirrorImageDataUrl(imageUrl);

  if (mirrored === imageUrl) {
    return null;
  }

  const mirroredVerdict = await classifyAngleOrientation(mirrored);
  const opposite: AngleOrientation = actual === "right" ? "left" : "right";

  if (mirroredVerdict !== opposite) {
    console.warn("angle orientation classifier not self-consistent — mirror skipped", {
      actual,
      mirroredVerdict,
    });

    return null;
  }

  return mirrored;
}

function correctionPrompt(angleLabel: string, rule: AngleRule, actual: AngleOrientation) {
  const want =
    rule.expected === "right"
      ? "the face/nose MUST point toward the RIGHT edge of the image"
      : rule.expected === "left"
        ? "the face/nose MUST point toward the LEFT edge of the image"
        : rule.expected === "back"
          ? "this MUST be an exact rear view with NO face visible"
          : rule.expected === "top"
            ? "this MUST be photographed from directly above the crown"
            : "this MUST be an exact front-facing portrait";

  return `ORIENTATION CORRECTION (previous attempt was wrong).
The previous render for slot "${angleLabel}" came out as "${actual.toUpperCase()}", which is incorrect.
For this slot, ${want}.
Do not copy the orientation of the reference images. The camera position for THIS slot is mandatory and overrides reference similarity.`;
}

/**
 * 생성된 각도 이미지의 방향을 검증하고 필요하면 교정한다.
 * 1) 비전 판정 → 맞으면 그대로(원본 유지 = 가르마 보존)
 * 2) 틀리면 교정 프롬프트로 1회 재생성 → 다시 판정
 * 3) 그래도 틀리고 "정확히 반대 방향"이면 좌우반전으로 강제 교정
 */
export async function enforceAngleOrientation({
  angleLabel,
  imageUrl,
  regenerate,
}: {
  angleLabel: string;
  imageUrl: string;
  regenerate?: (correction: string) => Promise<string>;
}): Promise<{ corrected: "none" | "regenerated" | "mirrored"; imageUrl: string }> {
  const rule = getAngleRule(angleLabel);

  if (!rule) {
    return { corrected: "none", imageUrl };
  }

  const first = await classifyAngleOrientation(imageUrl);

  if (first === "unknown" || isAcceptable(rule, first)) {
    return { corrected: "none", imageUrl };
  }

  console.warn("angle orientation mismatch", {
    actual: first,
    angleLabel,
    expected: rule.expected,
  });

  // 2) 재생성 1회 — 원본(비반전) 이미지를 얻을 수 있으면 가르마가 보존된다.
  if (regenerate) {
    try {
      const retried = await regenerate(correctionPrompt(angleLabel, rule, first));
      const second = await classifyAngleOrientation(retried);

      if (second === "unknown" || isAcceptable(rule, second)) {
        return { corrected: "regenerated", imageUrl: retried };
      }

      if (isOppositeSide(rule, second)) {
        const mirrored = await mirrorIfClassifierIsReliable(retried, second);

        if (mirrored) {
          return { corrected: "mirrored", imageUrl: mirrored };
        }
      }

      // 재생성본도 기대와 다르지만 반전으로 못 고치는 경우엔, 최소한 재생성본이
      // 더 나을 이유가 없으므로 원본을 유지한다(아래 3단계에서 재판정).
    } catch (error) {
      console.warn("angle orientation regenerate failed", error);
    }
  }

  // 3) 최후 수단: 정확히 반대 방향이면 반전으로 확정 교정
  //    (단, 판정기 자체 검증을 통과했을 때만 — 아니면 원본 유지)
  if (isOppositeSide(rule, first)) {
    const mirrored = await mirrorIfClassifierIsReliable(imageUrl, first);

    if (mirrored) {
      return { corrected: "mirrored", imageUrl: mirrored };
    }
  }

  return { corrected: "none", imageUrl };
}
