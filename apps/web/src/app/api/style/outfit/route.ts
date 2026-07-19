import { NextResponse } from "next/server";
import { resolveRequestedHairColor } from "@/lib/mirilook-colors";
import {
  getRegionProfile,
  sanitizeRegion,
  type MirilookRegionId,
} from "@/lib/mirilook-regions";
import {
  getStyleById,
  getStylesByAudience,
  sanitizeAudience,
  type MirilookAudience,
} from "@/lib/mirilook-styles";
import { editHairImage } from "@/lib/server/openai-image";
import { protectMutationRequest } from "@/lib/server/request-security";
import { logGenerationError } from "@/lib/server/generation-error-log";

export const runtime = "nodejs";
// gpt-image 코디 이미지 생성이 60초를 넘겨 Vercel 504로 죽는 것을 방지(상한 상향).
export const maxDuration = 150;

const outfitPartIds = [
  "full",
  "top",
  "bottom",
  "glasses",
  "shoes",
  "bag",
  "watch",
  "bracelet",
  "necklace",
  "earrings",
  "hat",
  "sunglasses",
  "earphones",
  "circle-lens",
] as const;

type OutfitPart = (typeof outfitPartIds)[number];

export async function POST(request: Request) {
  const securityError = protectMutationRequest(request, {
    maxBodyBytes: 40 * 1024 * 1024,
    rateLimit: {
      // One outfit board fires up to ~14 image requests at once (1 full body +
      // up to 13 items). 24/10min throttled a single click into 429s; allow a
      // few full boards per window so retries and repeat clicks don't fail.
      key: "style:outfit",
      limit: 90,
      windowMs: 10 * 60 * 1000,
    },
  });

  if (securityError) {
    return securityError;
  }

  try {
    if (!hasFormContentType(request)) {
      return NextResponse.json(
        { error: "코디 이미지를 만들 기준 사진이 필요합니다." },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const base = formData.get("base");
    const front = formData.get("front");
    const side = formData.get("side");
    const leftSide = formData.get("leftSide");
    const rightSide = formData.get("rightSide");
    const audience = sanitizeAudience(formData.get("audience"));
    const hairColorId = getString(formData.get("hairColorId"));
    const customHairColorHex = getString(formData.get("customHairColorHex"));
    const outfitPart = sanitizeOutfitPart(formData.get("outfitPart"));
    const query = sanitizeText(formData.get("query"), 160);
    const region = sanitizeRegion(formData.get("region"));
    const styleId = getString(formData.get("styleId"));
    const requestedStyleName = sanitizeText(formData.get("styleName"), 80);
    const isCelebrityReference = isCelebrityReferenceStyleId(styleId);
    const style = getStyleById(styleId);
    const styleName =
      style?.name ?? (requestedStyleName || "연예인 헤어 레퍼런스");
    const hairColor = resolveRequestedHairColor(hairColorId, customHairColorHex);

    if (!(base instanceof File) || !(front instanceof File) || !(side instanceof File)) {
      return NextResponse.json(
        { error: "선택 이미지, 정면 사진, 측면 사진이 모두 필요합니다." },
        { status: 400 },
      );
    }

    if (
      !hairColor ||
      (!isCelebrityReference &&
        (!style ||
          !getStylesByAudience(audience).some((item) => item.id === style.id)))
    ) {
      return NextResponse.json(
        { error: "지원하지 않는 헤어스타일 또는 컬러입니다." },
        { status: 400 },
      );
    }

    const imageUrl = await editHairImage({
      base,
      costLabel: outfitPart === "full" ? "outfit-full" : "outfit-item",
      front,
      leftSide: leftSide instanceof File ? leftSide : undefined,
      rightSide: rightSide instanceof File ? rightSide : undefined,
      side,
      source: "both",
      size:
        outfitPart === "full"
          ? process.env.OPENAI_OUTFIT_FULL_IMAGE_SIZE ?? "1024x1024"
          : process.env.OPENAI_OUTFIT_ITEM_IMAGE_SIZE ?? "1024x1024",
      prompt: buildOutfitPrompt({
        audience,
        hairColorName: hairColor.name,
        outfitPart,
        query,
        region,
        styleName,
      }),
    });

    return NextResponse.json({
      imageUrl,
      mode: "live",
      outfitPart,
    });
  } catch (error) {
    console.error(error);

    await logGenerationError({
      source: "outfit",
      error,
      assetType: "outfit_image",
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "코디 이미지 생성에 실패했습니다.",
      },
      { status: 500 },
    );
  }
}

function buildOutfitPrompt({
  audience,
  hairColorName,
  outfitPart,
  query,
  region,
  styleName,
}: {
  audience: MirilookAudience;
  hairColorName: string;
  outfitPart: OutfitPart;
  query: string;
  region: MirilookRegionId;
  styleName: string;
}) {
  const regionProfile = getRegionProfile(region);
  // 성별을 강하게 고정한다(실기기에서 남/여 구분이 흐려진다는 피드백 반영).
  const genderLock =
    audience === "female"
      ? "The customer is a WOMAN. Style this as unambiguously women's Korean fashion (women's cut, fit, and silhouette). Never dress the person in men's clothing."
      : "The customer is a MAN. Style this as unambiguously men's Korean fashion (men's cut, fit, and silhouette). Never dress the person in women's clothing or feminine silhouettes.";
  const audienceInstruction =
    audience === "female"
      ? "Korean women's fashion styling, polished but wearable, salon consultation friendly."
      : "Korean men's fashion styling, polished but wearable, salon consultation friendly.";
  // 매번 베이지/무채색으로 수렴한다는 피드백 반영: 헤어 컬러·계절에 맞춰 색을 고르고
  // 반복 생성 때 서로 달라 보이도록 명시한다.
  const varietyDirection = `Choose the outfit colors, materials, and silhouette specifically for this hairstyle "${styleName}", this hair color "${hairColorName}", and the season implied by the fashion direction. Do NOT default to a plain beige, ivory, or generic neutral look every time — use tasteful, intentional color that complements the hair color, and vary the styling so different generations do not look identical.`;

  if (outfitPart === "full") {
    return `
Create one photorealistic full-body fashion styling image for mirilook.
Use the uploaded generated hairstyle portrait as the identity and hairstyle reference.
Preserve the same person, same face, face fullness, skin tone, facial expression tone, hairstyle, hair length, hair color, and left-right orientation.
Do not change the haircut or face. Extend the composition into a realistic full-body outfit reference.
${genderLock}
The outfit should match this hairstyle: ${styleName}.
Hair color: ${hairColorName}.
Fashion direction: ${query}.
${varietyDirection}
Market region: ${regionProfile.englishLabel}. ${regionProfile.prompt}
${audienceInstruction}
Show a clean full-body standing shot from head to shoes, premium fitting-room or simple studio background, natural proportions, no extra people, no text, no watermark, no collage.
`;
  }

  const partInstruction = getOutfitPartInstruction(outfitPart);

  return `
Create one photorealistic fashion item recommendation image for mirilook.
${partInstruction}
${genderLock}
The item must harmonize with this hairstyle: ${styleName}.
Hair color context: ${hairColorName}.
Fashion search direction: ${query}.
${varietyDirection}
Market region: ${regionProfile.englishLabel}. ${regionProfile.prompt}
${audienceInstruction}
Use a premium neutral background, no model face required, no text, no logo, no watermark, no collage.
`;
}

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isCelebrityReferenceStyleId(styleId: string) {
  return (
    styleId === "celebrity-reference" ||
    styleId.startsWith("celebrity-reference-")
  );
}

function sanitizeOutfitPart(value: FormDataEntryValue | null): OutfitPart {
  return typeof value === "string" && outfitPartIds.includes(value as OutfitPart)
    ? (value as OutfitPart)
    : "full";
}

function getOutfitPartInstruction(outfitPart: OutfitPart) {
  switch (outfitPart) {
    case "top":
      return "Generate the recommended upper-body clothing item only: top, shirt, knit, blouse, tee, or light outerwear. Show it as a clean product-style image on a simple hanger or mannequin torso.";
    case "bottom":
      return "Generate the recommended bottom item only: pants, skirt, denim, slacks, or trousers. Show it as a clean product-style image, full item visible.";
    case "glasses":
      return "Generate the recommended eyeglasses only. Show one clean product-style pair of optical glasses, no face, no model.";
    case "shoes":
      return "Generate the recommended shoes only. Show one pair as a clean product-style image, full pair visible.";
    case "bag":
      return "Generate the recommended bag only. Show one clean product-style bag, no model, full product visible.";
    case "watch":
      return "Generate the recommended watch only. Show one clean product-style watch on a neutral surface.";
    case "bracelet":
      return "Generate the recommended bracelet only. Show one clean product-style bracelet on a neutral surface.";
    case "necklace":
      return "Generate the recommended necklace only. Show one clean product-style necklace on a neutral surface.";
    case "earrings":
      return "Generate the recommended earrings only. Show one clean product-style pair of earrings on a neutral surface.";
    case "hat":
      return "Generate the recommended hat or cap only. Show one clean product-style item, no model face.";
    case "sunglasses":
      return "Generate the recommended sunglasses only. Show one clean product-style pair of sunglasses, no face, no model.";
    case "earphones":
      return "Generate the recommended earphones or earbuds only. Show one clean product-style item on a neutral surface.";
    case "circle-lens":
      return "Generate a tasteful product-style circle lens recommendation visual: a clean cosmetic contact lens package and lens case mood image, no eye close-up, no medical claims, no text.";
    case "full":
      return "Generate the complete outfit.";
    default:
      return "Generate the recommended fashion item only as a clean product-style image.";
  }
}

function sanitizeText(value: FormDataEntryValue | null, maxLength: number) {
  return typeof value === "string"
    ? value.replace(/[<>]/g, "").trim().slice(0, maxLength)
    : "";
}

function hasFormContentType(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  return (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  );
}
