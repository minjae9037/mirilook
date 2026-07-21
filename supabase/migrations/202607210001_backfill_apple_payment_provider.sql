-- 2026-07-21(KST) 결제 이벤트의 스토어 정정: google_play → app_store
--
-- 배경: /api/payments/iap-grant 가 애플 결제도 provider="google_play"로 하드코딩해
-- 기록하고 있었다(커밋 ca33b7a에서 실제 스토어 기록으로 수정). 그 이전에 쌓인 행은
-- 스토어 구분 근거(raw_payload.store)가 없어 소급 판별이 불가능하다.
-- 다만 이 시점 미리룩은 **애플 인앱결제만 실제 결제가 가능한 상태**였으므로(대표님 확인),
-- 해당 일자의 인앱결제 건은 전부 App Store로 정정한다.
--
-- ⚠️ 데이터 정정(1회성)이며 스키마 변경이 아니다. 실행 전 STEP 1로 대상 건수를
-- 반드시 눈으로 확인할 것(예상 3건). 다른 날짜/구글 실결제가 섞이면 안 된다.
-- created_at은 timestamptz이므로 KST 기준 날짜로 비교한다.

-- ── STEP 1. 대상 확인 (먼저 이것만 실행) ──────────────────────────────────
-- select
--   id,
--   created_at at time zone 'Asia/Seoul' as created_kst,
--   provider,
--   event_type,
--   product_id,
--   amount,
--   status,
--   verified,
--   payment_id
-- from payment_events
-- where (created_at at time zone 'Asia/Seoul')::date = date '2026-07-21'
-- order by created_at desc;

-- ── STEP 2. 정정 실행 ────────────────────────────────────────────────────
update payment_events
set
  provider = 'app_store',
  updated_at = now()
where
  (created_at at time zone 'Asia/Seoul')::date = date '2026-07-21'
  and provider = 'google_play'
returning
  id,
  created_at at time zone 'Asia/Seoul' as created_kst,
  provider,
  product_id,
  amount,
  status;
