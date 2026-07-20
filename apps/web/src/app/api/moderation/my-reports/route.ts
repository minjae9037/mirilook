// 내가 접수한 신고 이력 조회/취소 (마이페이지 "신고 이력" 카테고리용).
// GET    → 내가 낸 신고 목록(대상 종류·사유·상태·일시)
// DELETE → 아직 처리 전(status=new)인 내 신고 취소
import {
  getSupabaseAdminClient,
  getVerifiedSupabaseUser,
} from "@/lib/server/supabase-admin";
import { protectMutationRequest } from "@/lib/server/request-security";

export const runtime = "nodejs";
export const maxDuration = 30;

const targetTypeLabels: Record<string, string> = {
  community_post: "커뮤니티 글",
  community_comment: "커뮤니티 댓글",
  community_message: "메시지",
  social_post: "커뮤니티 게시물",
  style_vote: "스타일 투표",
  review: "리뷰",
  share: "공유",
  consultation: "상담",
  user: "이용자",
};

const statusLabels: Record<string, string> = {
  new: "접수됨",
  reviewing: "검토 중",
  resolved: "처리 완료",
  dismissed: "반려됨",
};

function sanitizeUuid(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  return /^[a-f0-9-]{32,36}$/i.test(trimmed) ? trimmed : "";
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient();
  const user = await getVerifiedSupabaseUser(request);

  if (!supabase || !user) {
    return Response.json({ reports: [] });
  }

  const result = await supabase
    .from("moderation_events")
    .select("id, target_type, reason, status, created_at")
    .eq("reporter_profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (result.error) {
    console.error("my reports load failed", result.error);

    return Response.json({ reports: [] });
  }

  const reports = (result.data ?? []).map((row) => {
    const record = row as {
      id: string;
      target_type: string | null;
      reason: string | null;
      status: string | null;
      created_at: string | null;
    };

    return {
      createdAt: record.created_at,
      id: record.id,
      reason: record.reason || "신고",
      status: record.status || "new",
      statusLabel: statusLabels[record.status || "new"] || "접수됨",
      targetLabel: targetTypeLabels[record.target_type || ""] || "게시물",
      targetType: record.target_type,
    };
  });

  return Response.json({ reports });
}

export async function DELETE(request: Request) {
  const securityError = protectMutationRequest(request, {
    maxBodyBytes: 16 * 1024,
    rateLimit: {
      key: "moderation:my-reports:delete",
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
    reportId?: unknown;
  } | null;
  const reportId = sanitizeUuid(payload?.reportId);

  if (!reportId) {
    return Response.json(
      { accepted: false, reason: "report_required" },
      { status: 400 },
    );
  }

  // 본인이 낸, 아직 처리 전(new)인 신고만 취소 가능.
  const deleted = await supabase
    .from("moderation_events")
    .delete()
    .eq("id", reportId)
    .eq("reporter_profile_id", user.id)
    .eq("status", "new")
    .select("id");

  if (deleted.error) {
    console.error("my report withdraw failed", deleted.error);

    return Response.json(
      { accepted: false, reason: "supabase_delete_failed" },
      { status: 500 },
    );
  }

  if (!deleted.data?.length) {
    return Response.json(
      { accepted: false, reason: "not_cancelable" },
      { status: 409 },
    );
  }

  return Response.json({ accepted: true, reportId });
}
