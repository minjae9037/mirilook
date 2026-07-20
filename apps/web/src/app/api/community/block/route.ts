// 사용자 차단 API (App Store Guideline 1.2).
// POST   { blockedProfileId, postId? } → 차단(영구 저장) + 개발자 통지
// DELETE { blockedProfileId }          → 차단 해제
// GET                                   → 내가 차단한 프로필 id 목록(피드 필터용)
import {
  getSupabaseAdminClient,
  getVerifiedSupabaseUser,
} from "@/lib/server/supabase-admin";
import { queueNotificationEvent } from "@/lib/server/notifications";
import { protectMutationRequest } from "@/lib/server/request-security";

export const runtime = "nodejs";
export const maxDuration = 30;

function sanitizeUuid(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  return /^[a-f0-9-]{32,36}$/i.test(trimmed) ? trimmed : "";
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[<>]/g, "").trim().slice(0, maxLength);
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient();
  const user = await getVerifiedSupabaseUser(request);

  if (!supabase || !user) {
    return Response.json({ blocked: [], blockedIds: [] });
  }

  const result = await supabase
    .from("user_blocks")
    .select("blocked_id, created_at")
    .eq("blocker_id", user.id)
    .order("created_at", { ascending: false });

  if (result.error) {
    console.error("blocked list load failed", result.error);

    return Response.json({ blocked: [], blockedIds: [] });
  }

  const rows = (result.data ?? []) as Array<{
    blocked_id: string | null;
    created_at: string | null;
  }>;
  const blockedIds = rows
    .map((row) => row.blocked_id)
    .filter((id): id is string => Boolean(id));

  // 차단한 회원의 표시 이름/핸들을 붙여 마이페이지에서 관리(차단 해제)할 수 있게 한다.
  const profileMap = new Map<string, { display_name: string | null; handle: string | null }>();

  if (blockedIds.length) {
    const profiles = await supabase
      .from("profiles")
      .select("id, display_name, handle")
      .in("id", blockedIds);

    for (const profile of profiles.data ?? []) {
      const row = profile as {
        id: string;
        display_name: string | null;
        handle: string | null;
      };
      profileMap.set(row.id, { display_name: row.display_name, handle: row.handle });
    }
  }

  const blocked = rows
    .filter((row): row is { blocked_id: string; created_at: string | null } =>
      Boolean(row.blocked_id),
    )
    .map((row) => ({
      blockedAt: row.created_at,
      displayName: profileMap.get(row.blocked_id)?.display_name || "미리룩 회원",
      handle: profileMap.get(row.blocked_id)?.handle || "",
      id: row.blocked_id,
    }));

  return Response.json({ blocked, blockedIds });
}

export async function POST(request: Request) {
  const securityError = protectMutationRequest(request, {
    maxBodyBytes: 16 * 1024,
    rateLimit: {
      key: "community:block:write",
      limit: 60,
      windowMs: 10 * 60 * 1000,
    },
  });

  if (securityError) {
    return securityError;
  }

  const supabase = getSupabaseAdminClient();
  const user = await getVerifiedSupabaseUser(request);

  if (!supabase || !user) {
    return Response.json(
      { accepted: false, reason: !supabase ? "supabase_not_configured" : "auth_required" },
      { status: !supabase ? 503 : 401 },
    );
  }

  const payload = (await request.json().catch(() => null)) as {
    blockedProfileId?: unknown;
    postId?: unknown;
    reason?: unknown;
  } | null;
  const blockedId = sanitizeUuid(payload?.blockedProfileId);
  const postId = sanitizeUuid(payload?.postId);
  const reason = sanitizeText(payload?.reason, 120) || "커뮤니티에서 차단";

  if (!blockedId) {
    return Response.json(
      { accepted: false, reason: "target_required" },
      { status: 400 },
    );
  }

  if (blockedId === user.id) {
    return Response.json(
      { accepted: false, reason: "cannot_block_self" },
      { status: 400 },
    );
  }

  const insert = await supabase
    .from("user_blocks")
    .upsert(
      { blocked_id: blockedId, blocker_id: user.id, reason },
      { onConflict: "blocker_id,blocked_id" },
    );

  if (insert.error) {
    console.error("user block insert failed", insert.error);

    return Response.json(
      { accepted: false, reason: "supabase_insert_failed" },
      { status: 500 },
    );
  }

  // 차단 대상 게시물이 있으면 그 게시물에 대한 신고도 함께 접수해 개발자가 24시간 내 조치할 수 있게 한다.
  if (postId) {
    await supabase.from("moderation_events").insert({
      body: "사용자 차단과 함께 접수된 신고",
      reason: "사용자 차단",
      reporter_profile_id: user.id,
      status: "new",
      target_id: postId,
      target_type: "social_post",
    });
  }

  // 개발자 통지(차단 = 부적절 이용자 신고 성격).
  await queueNotificationEvent({
    body: `이용자 차단이 접수되었습니다. 차단 대상 프로필: ${blockedId}`,
    eventType: "moderation_report",
    payload: {
      action: "block",
      blockedId,
      blockerId: user.id,
      postId: postId || null,
    },
    title: "커뮤니티 이용자 차단",
    url: "/admin",
  });

  return Response.json({ accepted: true, blockedId });
}

export async function DELETE(request: Request) {
  const securityError = protectMutationRequest(request, {
    maxBodyBytes: 16 * 1024,
    rateLimit: {
      key: "community:block:delete",
      limit: 60,
      windowMs: 10 * 60 * 1000,
    },
  });

  if (securityError) {
    return securityError;
  }

  const supabase = getSupabaseAdminClient();
  const user = await getVerifiedSupabaseUser(request);

  if (!supabase || !user) {
    return Response.json(
      { accepted: false, reason: !supabase ? "supabase_not_configured" : "auth_required" },
      { status: !supabase ? 503 : 401 },
    );
  }

  const payload = (await request.json().catch(() => null)) as {
    blockedProfileId?: unknown;
  } | null;
  const blockedId = sanitizeUuid(payload?.blockedProfileId);

  if (!blockedId) {
    return Response.json(
      { accepted: false, reason: "target_required" },
      { status: 400 },
    );
  }

  const deleted = await supabase
    .from("user_blocks")
    .delete()
    .eq("blocker_id", user.id)
    .eq("blocked_id", blockedId);

  if (deleted.error) {
    console.error("user block delete failed", deleted.error);

    return Response.json(
      { accepted: false, reason: "supabase_delete_failed" },
      { status: 500 },
    );
  }

  return Response.json({ accepted: true, blockedId });
}
