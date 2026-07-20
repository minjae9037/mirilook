-- 사용자 차단(App Store Guideline 1.2 UGC 안전장치).
-- 차단하면 차단한 사람의 피드에서 상대 게시물이 즉시 사라지고(클라이언트 필터 + 재로드 시 서버 기준),
-- 차단 사실은 개발자에게 통지된다(reports/notifications 경유).
create table if not exists public.user_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  reason text null,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint user_blocks_not_self check (blocker_id <> blocked_id)
);

create index if not exists user_blocks_blocker_idx
  on public.user_blocks (blocker_id, created_at desc);

alter table public.user_blocks enable row level security;

drop policy if exists "service role can manage user blocks" on public.user_blocks;
create policy "service role can manage user blocks"
  on public.user_blocks
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 차단/신고를 개발자 콘솔에서 유저 단위로도 볼 수 있게 moderation_events에 'user' 대상 허용.
alter table public.moderation_events
  drop constraint if exists moderation_events_target_type_check;

alter table public.moderation_events
  add constraint moderation_events_target_type_check
  check (
    target_type in (
      'community_post',
      'community_comment',
      'community_message',
      'social_post',
      'style_vote',
      'review',
      'share',
      'consultation',
      'user'
    )
  );
