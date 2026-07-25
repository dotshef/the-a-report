-- 0002_report_title.sql — 종목별 리포트 제목/분류 (뉴스 기반, 오프라인 1회 생성)
-- 데이터 흐름: news 테이블 → (오프라인 AI 생성) → report_title.csv → 이 테이블로 임포트.
-- 런타임에는 생성하지 않는다. loader가 이 테이블을 우선 읽고, 없으면 코드 폴백
-- (src/data/report-titles.ts:generateTitles)으로 degrade.

-- 종목당 정확히 2행(slot 0,1). title은 "~일까?" 의문문, category는 6개 분류 enum 제약.
create table if not exists report_title (
  code     text     not null references stock(code),
  slot     smallint not null check (slot in (0, 1)),   -- 종목당 2개
  title    text     not null,                          -- 리포트 제목(의문문, 뉴스 근거)
  category text     not null check (category in
    ('실적', '성장성', '밸류에이션', '수급·모멘텀', '산업·정책', '리스크')),
  primary key (code, slot)
);

-- CSV 임포트 예:
--   \copy report_title (code, slot, title, category) from 'report_title.csv' csv header
