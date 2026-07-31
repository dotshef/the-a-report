-- 광고 유입 매체를 화이트리스트로 고정 (docs/광고-유입-정보-수집-전략.md §2).
-- traffic_source는 'google' | 'naver' | 'unknown' 세 값만 갖는다. 매체 판정은
-- 파라미터 존재 여부로만 하며(src/lib/tracking.ts), 판정 불가는 전부 unknown이다.
--
-- 카카오·메타 등 매체를 추가할 때는 tracking.ts의 판정 파라미터와 이 제약을 함께 넓힌다.

-- 제약 도입 전 데이터 정리.
-- 이 마이그레이션 이전에는 utm_source 값이나 referrer 호스트명이 그대로 들어가
-- 화이트리스트 밖 값이 남아 있다. 원본 진입 URL은 landing_url에 보존돼 있으므로
-- 필요하면 거기서 재파싱할 수 있다.
update report_request
   set traffic_source = 'unknown'
 where traffic_source not in ('google', 'naver', 'unknown');

alter table report_request
  drop constraint if exists report_request_traffic_source_check;

alter table report_request
  add constraint report_request_traffic_source_check
  check (traffic_source in ('google', 'naver', 'unknown'));

-- 매체별 리드 집계용.
create index if not exists report_request_traffic_source_idx
  on report_request (traffic_source, created_at desc);
