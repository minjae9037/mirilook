import { readServerEnv } from "@/lib/server/env";
import { protectMutationRequest } from "@/lib/server/request-security";
import {
  getConsultationStorageBucket,
  getProfilePhotoStorageBucket,
  getSocialPostStorageBucket,
  getSupabaseAdminClient,
  getVerifiedSupabaseUser,
} from "@/lib/server/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

// 계정 삭제. Google Play는 계정 생성이 있는 앱에 인앱 삭제 경로를 의무화한다.
//
// ⚠️ 얼굴 사진은 DB가 아니라 Storage에 있다. profiles 행만 지우면(auth.users cascade)
// 사진이 버킷에 남는다 — 그게 이 서비스에서 가장 민감한 데이터다. 그래서 버킷별로
// 경로 규칙이 다른 것을 각각 처리한다:
//   · 프로필 사진   mirilook-profile-photos : `${userId}/...`      → prefix 나열 후 삭제
//   · 소셜/DM 이미지 mirilook-social-posts   : `${profileId}/...`   → prefix 나열 후 삭제
//   · 상담 이미지   fitcut-consultations    : `${sessionId}/...`   → 세션을 조회해 prefix 확보
//
// DB는 profiles.id → auth.users(id) on delete cascade 이므로 auth 사용자를 지우면
// 프로필이 연쇄 삭제되고, 하위 테이블은 각자의 cascade/set null 규칙을 따른다.
// (커뮤니티 게시글 등은 set null이라 익명 데이터로 남는다 — 개인 식별자는 제거된다.)

type DeleteSummary = {
  removedStorageObjects: number;
  buckets: Record<string, number>;
};

export async function DELETE(request: Request) {
  const securityError = protectMutationRequest(request, {
    maxBodyBytes: 4 * 1024,
    rateLimit: { key: "account:delete", limit: 5, windowMs: 60 * 60 * 1000 },
  });

  if (securityError) {
    return securityError;
  }

  const user = await getVerifiedSupabaseUser(request);

  if (!user) {
    return Response.json({ error: "not_authenticated" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  const summary: DeleteSummary = { removedStorageObjects: 0, buckets: {} };

  async function removeByPrefix(bucket: string, prefix: string) {
    // 한 번에 최대 100개씩 나열해 모두 지운다(파일이 많은 세션 대비).
    for (let page = 0; page < 20; page += 1) {
      const listed = await supabase!.storage
        .from(bucket)
        .list(prefix, { limit: 100, offset: 0 });

      if (listed.error || !listed.data?.length) {
        return;
      }

      const paths = listed.data.map((item) => `${prefix}/${item.name}`);
      const removed = await supabase!.storage.from(bucket).remove(paths);

      if (removed.error) {
        console.error("account delete: storage remove failed", bucket, removed.error);
        return;
      }

      summary.removedStorageObjects += paths.length;
      summary.buckets[bucket] = (summary.buckets[bucket] ?? 0) + paths.length;

      if (listed.data.length < 100) {
        return;
      }
    }
  }

  try {
    // 1) 사용자 폴더 기준 버킷
    await removeByPrefix(getProfilePhotoStorageBucket(), user.id);
    await removeByPrefix(getSocialPostStorageBucket(), user.id);

    // 2) 상담 버킷은 세션 id가 폴더다 — 이 사용자의 세션을 먼저 찾는다.
    const sessions = await supabase
      .from("generation_sessions")
      .select("id")
      .eq("profile_id", user.id)
      .limit(500)
      .returns<Array<{ id: string }>>();

    if (sessions.error) {
      console.error("account delete: session lookup failed", sessions.error);
    } else {
      const bucket = getConsultationStorageBucket();

      for (const session of sessions.data ?? []) {
        await removeByPrefix(bucket, session.id);
      }
    }

    // 3) auth 사용자 삭제 → profiles cascade → 하위 테이블은 각자 규칙대로.
    const deleted = await supabase.auth.admin.deleteUser(user.id);

    if (deleted.error) {
      console.error("account delete: auth delete failed", deleted.error);
      return Response.json(
        { error: "account_delete_failed", reason: deleted.error.message },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("account delete failed", error);
    return Response.json({ error: "account_delete_failed" }, { status: 500 });
  }

  return Response.json({ deleted: true, ...summary });
}

// 삭제 전에 무엇이 지워지는지 사용자가 확인할 수 있도록 요약을 준다.
export async function GET(request: Request) {
  const user = await getVerifiedSupabaseUser(request);

  if (!user) {
    return Response.json({ error: "not_authenticated" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  const [sessions, wallet] = await Promise.all([
    supabase
      .from("generation_sessions")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", user.id),
    supabase
      .from("hair_money_accounts")
      .select("balance")
      .eq("profile_id", user.id)
      .maybeSingle(),
  ]);

  return Response.json({
    email: user.email ?? null,
    consultationCount: sessions.count ?? 0,
    hairMoneyBalance: Number(wallet.data?.balance ?? 0),
    supportEmail: readServerEnv("MIRILOOK_SUPPORT_EMAIL") || "jipsa.admin@gmail.com",
  });
}
