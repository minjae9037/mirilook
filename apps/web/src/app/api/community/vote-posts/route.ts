import { HairMoneyVotePostCost } from "@/lib/mirilook-payments";
import { isObjectionableContent } from "@/lib/server/content-moderation";
import {
  refundHairMoneyForVotePost,
  spendHairMoneyForVotePost,
} from "@/lib/server/hair-money";
import { queueNotificationEvent } from "@/lib/server/notifications";
import { protectMutationRequest } from "@/lib/server/request-security";
import {
  getSocialPostStorageBucket,
  getSupabaseAdminClient,
  getVerifiedSupabaseUser,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

type CreatePayload = {
  audience?: "all" | "opposite";
  dmPolicy?: "allow" | "deny";
  hairColorName?: string;
  imageDataUrl?: string;
  requesterGender?: "male" | "female" | "other";
  styleName?: string;
};

// POST — 스튜디오 추천 이미지를 투표글로 게시(2 HM 차감 → 이미지 업로드 → 게시글 생성, 실패 시 롤백).
export async function POST(request: Request) {
  const securityError = protectMutationRequest(request, {
    maxBodyBytes: 12 * 1024 * 1024,
    rateLimit: {
      key: "community:vote-posts:create",
      limit: 12,
      windowMs: 10 * 60 * 1000,
    },
  });
  if (securityError) return securityError;

  let payload: CreatePayload;
  try {
    payload = (await request.json()) as CreatePayload;
  } catch {
    return Response.json(
      { accepted: false, reason: "invalid_payload" },
      { status: 400 },
    );
  }

  const user = await getVerifiedSupabaseUser(request);
  if (!user) {
    return Response.json(
      { accepted: false, reason: "not_authenticated" },
      { status: 401 },
    );
  }

  const image = parseDataUrl(payload.imageDataUrl);
  if (!image) {
    return Response.json(
      { accepted: false, reason: "image_required" },
      { status: 400 },
    );
  }
  if (image.buffer.byteLength > MAX_IMAGE_BYTES) {
    return Response.json(
      { accepted: false, reason: "image_too_large" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return Response.json({ accepted: false, reason: "supabase_not_configured" });
  }

  const requesterGender = normalizeGender(payload.requesterGender);
  const targetGender =
    payload.audience === "opposite" ? oppositeGender(requesterGender) : null;
  const dmPolicy = payload.dmPolicy === "allow" ? "allow" : "deny";
  const styleName = sanitizeText(payload.styleName, 80) ?? "내 스타일";
  const hairColorName = sanitizeText(payload.hairColorName, 80);

  // 부적절 문구는 Hair Money 차감 전에 먼저 막는다(무과금).
  if (isObjectionableContent(styleName) || isObjectionableContent(hairColorName)) {
    return Response.json(
      { accepted: false, reason: "objectionable_content" },
      { status: 422 },
    );
  }

  const requestId = `vote_${user.id}_${Date.now()}`;

  // 1) HM 차감 (멱등: source_type=vote_post, source_id=requestId)
  const charge = await spendHairMoneyForVotePost({
    profileId: user.id,
    requestId,
  });
  if (!charge.applied) {
    // synced=true면 RPC가 돌았고 잔액 부족 → 402, 아니면 인프라 오류 → 503.
    return Response.json(
      {
        accepted: false,
        reason: charge.reason ?? "insufficient_balance",
        cost: HairMoneyVotePostCost,
        balance: charge.balance,
      },
      { status: charge.synced ? 402 : 503 },
    );
  }

  const bucket = getSocialPostStorageBucket();

  // 2) 이미지 업로드
  const storagePath = `${user.id}/vote-${Date.now()}.${image.ext}`;
  const upload = await supabase.storage
    .from(bucket)
    .upload(storagePath, image.buffer, {
      contentType: image.mime,
      upsert: false,
    });
  if (upload.error) {
    console.error("vote image upload failed", upload.error);
    await refundHairMoneyForVotePost({ profileId: user.id, requestId }).catch(
      () => null,
    );
    return Response.json(
      { accepted: false, reason: "storage_upload_failed" },
      { status: 500 },
    );
  }

  // 3) 게시글 생성 (즉시 공개 — 관리자 승인 없이)
  const body = hairColorName
    ? `${styleName} · ${hairColorName} — 이 스타일 어떤가요? 좋아요/싫어요로 투표해 주세요.`
    : `${styleName} — 이 스타일 어떤가요? 좋아요/싫어요로 투표해 주세요.`;
  const insert = await supabase
    .from("community_posts")
    .insert({
      anonymous_name: "익명",
      body,
      dm_policy: dmPolicy,
      image_paths: [storagePath],
      post_type: "vote",
      profile_id: user.id,
      requester_gender: requesterGender,
      status: "published",
      target_gender: targetGender,
      title: styleName,
      visibility: "public",
    })
    .select("id")
    .single();

  if (insert.error) {
    console.error("vote post insert failed", insert.error);
    await supabase.storage.from(bucket).remove([storagePath]);
    await refundHairMoneyForVotePost({ profileId: user.id, requestId }).catch(
      () => null,
    );
    return Response.json(
      { accepted: false, reason: "supabase_insert_failed" },
      { status: 500 },
    );
  }

  // 커뮤니티 피드(social_posts)에도 같은 이미지를 노출한다(투표 글도 커뮤니티에 공개).
  // 실패해도 투표 게시 자체는 성공 처리(피드 노출은 부가 기능).
  try {
    const profile = await supabase
      .from("profiles")
      .select("display_name, handle")
      .eq("id", user.id)
      .maybeSingle();
    const displayName =
      (typeof profile.data?.display_name === "string" &&
        profile.data.display_name.trim()) ||
      (user.email ? user.email.split("@")[0] : "") ||
      "Miri Look 회원";
    const handle =
      (typeof profile.data?.handle === "string" && profile.data.handle.trim()) ||
      `user_${user.id.slice(0, 8)}`;
    const base = {
      body: `${body} (스타일 투표)`,
      display_name: displayName,
      dm_policy: dmPolicy,
      handle,
      hashtags: ["스타일투표"],
      image_path: storagePath,
      profile_id: user.id,
      recommendation_score: 0,
      status: "published",
      visibility: "public",
    };
    const mirror = await supabase
      .from("social_posts")
      .insert({ ...base, image_paths: [storagePath] });
    if (mirror.error) {
      // image_paths 컬럼이 없는 구버전 스키마 대응 — image_path만으로 재시도.
      const legacy = await supabase.from("social_posts").insert(base);
      if (legacy.error) {
        console.error("vote post community mirror failed", legacy.error);
      }
    }
  } catch (error) {
    console.error("vote post community mirror failed", error);
  }

  await queueNotificationEvent({
    body: "새 스타일 투표가 게시되었습니다. 커뮤니티에서 확인해 보세요.",
    eventType: "community_vote",
    payload: { postId: insert.data?.id, styleName },
    title: "스타일 투표 게시",
    url: "/votes",
  });

  return Response.json({
    accepted: true,
    balance: charge.balance,
    charged: HairMoneyVotePostCost,
    postId: insert.data?.id,
  });
}

// GET — 공개된 투표글 목록(이미지 서명URL + 좋아요/싫어요 집계 + 내 투표 여부).
export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return Response.json({ posts: [], reason: "supabase_not_configured" });
  }

  const user = await getVerifiedSupabaseUser(request).catch(() => null);

  const posts = await supabase
    .from("community_posts")
    .select(
      "id, title, body, image_paths, profile_id, requester_gender, target_gender, dm_policy, created_at",
    )
    .eq("post_type", "vote")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(60);

  if (posts.error || !posts.data) {
    return Response.json({ posts: [], reason: "lookup_failed" });
  }

  const postIds = posts.data.map((post) => post.id);
  const votes = postIds.length
    ? await supabase
        .from("style_votes")
        .select("post_id, vote_value, voter_profile_id")
        .in("post_id", postIds)
        .not("vote_value", "is", null)
    : { data: [] as Array<Record<string, unknown>>, error: null };

  const tally = new Map<
    string,
    { like: number; dislike: number; mine: string | null }
  >();
  for (const id of postIds) tally.set(id, { like: 0, dislike: 0, mine: null });
  for (const vote of votes.data ?? []) {
    const row = vote as {
      post_id: string;
      vote_value: string | null;
      voter_profile_id: string | null;
    };
    const entry = tally.get(row.post_id);
    if (!entry) continue;
    if (row.vote_value === "like") entry.like += 1;
    else if (row.vote_value === "dislike") entry.dislike += 1;
    if (user && row.voter_profile_id === user.id) entry.mine = row.vote_value;
  }

  const bucket = getSocialPostStorageBucket();
  const result = await Promise.all(
    posts.data.map(async (post) => {
      const path = Array.isArray(post.image_paths) ? post.image_paths[0] : null;
      let imageUrl: string | null = null;
      if (path) {
        const signed = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 60 * 60);
        imageUrl = signed.data?.signedUrl ?? null;
      }
      const entry = tally.get(post.id) ?? { like: 0, dislike: 0, mine: null };
      return {
        body: post.body,
        createdAt: post.created_at,
        dislikeCount: entry.dislike,
        dmPolicy: post.dm_policy,
        id: post.id,
        imageUrl,
        isMine: user ? post.profile_id === user.id : false,
        likeCount: entry.like,
        myVote: entry.mine,
        targetGender: post.target_gender,
        title: post.title,
      };
    }),
  );

  return Response.json({ posts: result });
}

function parseDataUrl(value: unknown) {
  if (typeof value !== "string") return null;
  const match = value.match(
    /^data:(image\/(png|jpeg|jpg|webp));base64,([A-Za-z0-9+/=]+)$/,
  );
  if (!match) return null;
  const mime = match[1];
  const ext = match[2] === "jpeg" ? "jpg" : match[2];
  try {
    const buffer = Buffer.from(match[3], "base64");
    if (!buffer.byteLength) return null;
    return { buffer, ext, mime };
  } catch {
    return null;
  }
}

function normalizeGender(value: unknown) {
  if (value === "male" || value === "female" || value === "other") return value;
  return null;
}

function oppositeGender(value: "female" | "male" | "other" | null) {
  if (value === "male") return "female";
  if (value === "female") return "male";
  return null;
}

function sanitizeText(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}
