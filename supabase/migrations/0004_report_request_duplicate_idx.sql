-- 리드 중복 접수 판정용 인덱스 (이름+연락처 완전일치 + 최근 접수 이력 조회).
-- 판정은 애플리케이션 레벨(SELECT 후 판단, src/lib/supabase.ts:hasRecentDuplicateReportRequest)에서
-- 하며, DB에는 unique 제약을 걸지 않는다 — 같은 사람이 시간을 두고 재문의하는 정상 케이스까지
-- 막지 않기 위함이다. 이 인덱스는 그 조회(name, phone 완전일치 + requested_at 최근순) 성능용.
create index if not exists report_request_name_phone_requested_idx
  on report_request (name, phone, requested_at desc);
