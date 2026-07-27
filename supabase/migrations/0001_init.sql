-- 0001_init.sql — 초기 스키마 (docs/implementation-plan.md 기준)
-- 데이터 흐름: KIS → Vercel Cron(ingest) → Supabase → 클라이언트(항상 DB만 읽음)
-- 접근 제어: 서버 서비스롤 전용. RLS 미사용(v1). kis_token은 시크릿.

-- ─── 수집 인프라 ────────────────────────────────────────────────────────────

-- 토큰 캐시(단일 행). cron 여러 invocation이 재사용 → 발급 "1분1회" 제한 회피.
create table if not exists kis_token (
  id           smallint primary key default 1 check (id = 1),
  access_token text        not null,
  token_type   text        not null default 'Bearer',
  expires_at   timestamptz not null,
  updated_at   timestamptz not null default now()
);

-- 재개 커서 + 데이터셋 가용성.
create table if not exists ingest_state (
  code       text        not null,          -- 종목코드. 시장전역은 '_MARKET_'
  dataset    text        not null,
  status     text        not null default 'ok',  -- 'ok' | 'unavailable' | 'error'
  fetched_at timestamptz not null default now(),
  error      text,
  primary key (code, dataset)
);
create index if not exists ingest_state_dataset_fetched_idx on ingest_state (dataset, fetched_at);

-- 리스 락(cron 겹침 방지, 크래시 내성).
create table if not exists cron_lock (
  name       text        primary key,
  owner      text,
  expires_at timestamptz not null
);

-- ─── 종목 디멘션 (사용자 직접 적재) ─────────────────────────────────────────

-- market 'K'=KOSPI 'Q'=KOSDAQ, group_code 'ST'=주권.
-- 보통주 일반종목 판정(주권 & 코드 끝자리 '0')은 DB가 아니라 앱(서버 로직)이 소유한다:
-- src/data/stock.ts:isCommonStock(). DB는 원천 컬럼만 저장(파생 컬럼 없음).
create table if not exists stock (
  code       text    primary key,           -- 단축코드 6자리
  name       text    not null,
  group_code text    not null,
  market     char(1) not null,
  industry   text                            -- quote 콜에 편승해 야간 갱신
);
create index if not exists stock_group_code_idx on stock (group_code);

-- ─── 팩트 ───────────────────────────────────────────────────────────────────

-- 일봉 3개월(차트 + 현재가/전일대비/당일 고저 파생). "현재가"=최신 행 close.
create table if not exists price_daily (
  code   text   not null references stock(code),
  date   date   not null,
  open   bigint, high bigint, low bigint, close bigint,
  volume bigint,
  primary key (code, date)
);

-- 52주 최고/최저 스냅샷 (inquire-price w52_hgpr/lwpr). 종목당 1행 upsert.
create table if not exists fundamental (
  code        text primary key references stock(code),
  week52_high bigint,
  week52_low  bigint,
  as_of       timestamptz not null
);

-- 종목당 뉴스. 재수집 중복은 unique로 흡수.
create table if not exists news (
  id           bigserial primary key,
  code         text not null references stock(code),
  title        text not null,
  source       text,
  published_at timestamptz,
  unique (code, published_at, title)
);
create index if not exists news_code_published_idx on news (code, published_at desc);

-- 조회상위(HTS). is_common 필터 후 원자 교체. "지금 많이 찾는 종목" 원천.
create table if not exists top_view (
  rank       int  primary key,
  code       text not null references stock(code),
  fetched_at timestamptz not null default now()
);

-- 투자의견(증권사×발표일). 트렌딩 필터용 — top_view 후보 코드에 대해서만 채운다.
create table if not exists invest_opinion (
  code         text not null references stock(code),
  opinion_date date not null,
  firm         text not null,
  opinion      text,        -- 매수/중립/매도
  target_price bigint,
  gap_rate     numeric,
  primary key (code, opinion_date, firm)
);
create index if not exists invest_opinion_code_date_idx on invest_opinion (code, opinion_date desc);

-- ─── 리드 (KST 타임존) ──────────────────────────────────────────────────────

-- 리포트 신청 기록(리드) + 유입/광고 트래킹.
create table if not exists report_request (
  id                bigserial   primary key,
  name              text        not null,
  phone             text        not null,
  interest          text,
  requested_at      timestamp without time zone not null default (now() at time zone 'Asia/Seoul'),
  created_at        timestamp without time zone not null default (now() at time zone 'Asia/Seoul'),
  traffic_source    text        not null default 'unknown',
  ad_keyword        text,
  ad_campaign_id    text,
  ad_campaign_label text,
  landing_url       text
);
create index if not exists report_request_created_idx on report_request (created_at desc);
create index if not exists report_request_phone_idx   on report_request (phone);

-- 휴대폰 인증. 평문 코드 미저장: code_hash. 만료/실패횟수/검증시각 관리.
create table if not exists phone_verification (
  id          bigserial   primary key,
  phone       text        not null,
  name        text,                          -- 인증 요청 시점의 이름(리드 이름과 대조용)
  code_hash   text        not null,          -- SHA-256(code + SMS_VERIFICATION_SECRET)
  expires_at  timestamp with time zone not null,
  fail_count  smallint    not null default 0,
  verified_at timestamp without time zone,
  created_at  timestamp without time zone not null default (now() at time zone 'Asia/Seoul')
);
create index if not exists phone_verification_phone_created_idx
  on phone_verification (phone, created_at desc);

-- 접근제어 v1: RLS 미사용. DB 접근은 서버 서비스롤 전용, 자격증명 NEXT_PUBLIC_ 금지.
