# KIS 데이터 아키텍처 — 수정 구현 계획

> 본 문서는 [`../prd/prd.md`](../prd/prd.md) + 레퍼런스 [`dotshef/plan-landing`](https://github.com/dotshef/plan-landing) 분석을 토대로 한 **재설계 구현 계획**이다.
> 기존 [`../project-plan.md`](../project-plan.md)(요청 시 KIS 호출 방식)을 대체한다.

## 0. 확정된 결정 사항

| # | 결정 |
|---|---|
| 1 | **Vercel Pro 가정** — 5분 cron + `maxDuration 800s` 사용 가능 |
| 2 | 트렌딩 = `top_view` 상위 10 중 **투자의견이 있는 종목만** 최대 8개 → 경량 `invest_opinion` 추가 |
| 3 | `price_daily`는 **3개월치만**, 용도는 **차트(+현재가/전일대비/당일 고저 파생)** 로 한정 |
| 4 | **`@supabase/supabase-js` 도입** (서비스롤 서버 클라이언트) |
| 5 | `stock` 마스터는 **사용자가 직접 적재** (시드 코드 미포함). 시드 전엔 빈 상태로 렌더 |

## 1. 아키텍처 원칙

```
KIS ──(cron ingest 전용)──▶ Supabase ──(read-only)──▶ 사용자 요청경로(SSR/API)
        ▲ 토큰 DB공유 · 리스락 · 재개커서 · 레이트리미터
```

- **요청경로는 KIS를 절대 호출하지 않는다.** 모든 KIS 호출은 야간 cron(`/api/cron/ingest`)에서만.
- 사용자 상호작용은 **오직 Supabase read**. (요구사항 5)
- 접근제어 v1: **RLS 미사용, 서버 서비스롤 전용**. 비밀 자격증명(`SUPABASE_URL`/서비스롤/KIS 키 등)은 `NEXT_PUBLIC_` 금지 — 공개 변수는 Turnstile site key 하나뿐. `kis_token`은 시크릿(레퍼런스 정책 준수).
- KIS 호출은 **cron 전용**이므로 요청 지연·장애·rate-limit이 사용자 경험과 분리된다.

## 2. 데이터 모델 (레퍼런스의 PRD-축소 서브셋)

### 2.1 수집 인프라
```sql
-- 토큰 캐시(단일 행). cron 여러 invocation이 재사용 → 발급 "1분1회" 제한 회피.
create table if not exists kis_token (
  id           smallint primary key default 1 check (id = 1),
  access_token text not null,
  token_type   text not null default 'Bearer',
  expires_at   timestamptz not null,
  updated_at   timestamptz not null default now()
);

-- 재개 커서 + 데이터셋 가용성.
create table if not exists ingest_state (
  code       text not null,          -- 종목코드. 시장전역은 '_MARKET_'
  dataset    text not null,
  status     text not null default 'ok',   -- 'ok' | 'unavailable' | 'error'
  fetched_at timestamptz not null default now(),
  error      text,
  primary key (code, dataset)
);
create index if not exists ingest_state_dataset_fetched_idx on ingest_state (dataset, fetched_at);

-- 리스 락(cron 겹침 방지, 크래시 내성).
create table if not exists cron_lock (
  name       text primary key,
  owner      text,
  expires_at timestamptz not null
);
```

### 2.2 종목 디멘션 (사용자 시드)
```sql
-- market 'K'=KOSPI 'Q'=KOSDAQ, group_code 'ST'=주권. 사용자가 직접 적재.
-- 보통주 일반종목 판정(주권 & 코드 끝자리 '0')은 DB가 아니라 앱이 소유:
-- src/data/stock.ts:isCommonStock(). DB엔 파생 컬럼(is_common) 없음.
create table if not exists stock (
  code       text    primary key,
  name       text    not null,
  group_code text    not null,
  market     char(1) not null,
  industry   text                    -- quote 콜에 편승해 야간 갱신
);
create index if not exists stock_group_code_idx on stock (group_code);  -- cron 유니버스(ST)
```

### 2.3 팩트
```sql
-- 일봉 3개월(차트 + 현재가/전일대비/당일 고저 파생). "현재가"=최신 행 close.
create table if not exists price_daily (
  code   text not null references stock(code),
  date   date not null,
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

-- 종목당 뉴스 5건. 재수집 중복은 unique로 흡수.
create table if not exists news (
  id           bigserial primary key,
  code         text not null references stock(code),
  title        text not null,
  source       text,
  published_at timestamptz,
  unique (code, published_at, title)
);
create index if not exists news_code_published_idx on news (code, published_at desc);

-- 조회상위(HTS). 앱의 isCommonStock() 필터 후 원자 교체. "지금 많이 찾는 종목" 원천.
create table if not exists top_view (
  rank       int  primary key,
  code       text not null references stock(code),
  fetched_at timestamptz not null default now()
);

-- 투자의견(증권사×발표일). 트렌딩 필터용 — top_view 상위 후보 코드에 대해서만 채운다.
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
```

### 2.4 리드 (기존 유지 — KST 타임존)
`report_request`(신청 기록 + 유입/광고 추적), `phone_verification`(code_hash 인증)은 앞선
[`../supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) 정의를 그대로 승계한다.
(단 v1 접근정책은 위 인프라와 동일하게 서비스롤 전용으로 통일)

> **제외**: 재무(income/ratio)·수급(investor/program)·배당·지수(market_index)는 PRD 범위 밖 → 미도입.

## 3. 파생값 (저장 안 하고 read-time 계산 — `src/data/derive.ts`)

| 값 | 계산 | 원천 |
|---|---|---|
| 현재가 | 최신 행 `close` | `price_daily` |
| 전일대비·등락률 | 최신 2행 `close` 차 | `price_daily` |
| 당일 고가/저가 | 최신 행 `high`/`low` | `price_daily` |
| 3개월 차트 | 최근 ~63행 `close` | `price_daily` |
| 52주 최고/최저 | 그대로 | `fundamental` |
| 트렌딩 | 상위 10 ∩ 투자의견 보유 → 8 | `top_view` ⨝ `invest_opinion` |

## 4. 수집 파이프라인

### 4.1 종목당 KIS 콜 = 3 (레퍼런스 11 → 대폭 축소)
| 데이터셋 | API (tr_id) | 대상 테이블 |
|---|---|---|
| `daily` | 기간별시세 `FHKST03010100` (최근 ~95일) | `price_daily` |
| `quote` | 현재가 `FHKST01010100` | `fundamental`(52주) + `stock.industry` |
| `news` | 뉴스 `FHKST01011800` | `news` |
| `top_view` (시장) | 조회상위 `HHMCM000100C0` (`custtype:P`) | `top_view` |
| `top_opinions` (시장 후속) | 투자의견 `FHKST663300C0` — **top_view 후보 코드만** | `invest_opinion` |

`top_opinions`는 종목 전수가 아니라 `top_view` 상위 코드(~10–20개)에 대해서만 호출 → 야간 추가 콜 미미.

### 4.2 파일 구조
```
src/lib/db/server.ts             # createClient(service_role) — db()
src/lib/kis/config.ts            # KIS_BASE_URL, KIS_RATE_PER_SEC
src/lib/kis/token.ts             # getAccessToken() — kis_token DB 캐시(만료 10분 전 갱신)
src/lib/kis/rate-limit.ts        # RateLimiter(단일 워커 순차, 병렬 금지) + limiter
src/lib/kis/client.ts            # kisGet(path, params, tr_id): 토큰+리미터+헤더
src/lib/kis/datasets/shared.ts   # DatasetResult, num/toDate/toTimestamp, dedupeByKey, MARKET_CODE
src/lib/kis/datasets/stock.ts    # daily / quote / news        → STOCK_DATASETS
src/lib/kis/datasets/market.ts   # top_view / top_opinions      → MARKET_DATASETS
src/lib/ingest/lock.ts           # acquireLock / renewLock / releaseLock
src/lib/ingest/cursor.ts         # selectStaleStocks / isMarketDatasetFresh
src/lib/ingest/pump.ts           # runBatch(chunk 순차→멱등 upsert→ingest_state)
src/app/api/cron/ingest/route.ts # Bearer 보호 + 락 + runBatch (기존 update-prices 대체)
```

### 4.3 Pump 동작 (레퍼런스 파라미터 채택)
- **케이던스**: Vercel Cron `*/5 * * * *` (Pro). `runtime=nodejs`, `maxDuration=800`, time budget 700s.
- **락**: `acquireLock('ingest')` 실패 시 즉시 skip. 종목마다 `renewLock` heartbeat(TTL 120s).
- **커서**: `selectStaleStocks(150)` — 최근 **12h 내 `_all_` 완료 종목 제외**(멱등·재실행 안전). `group_code='ST'` 유니버스를 **1000행 페이지네이션**으로 순회(PostgREST 한계). `unavailable` 데이터셋은 재호출 억제, 실패는 다음 실행 자동 재시도(자가치유).
- **청크**: `CHUNK_SIZE=150`. 종목당 3콜 → 실행당 ~450콜. ~2,651 ST를 여러 실행으로 분산(~18청크 → 야간 내 완주).
- **리미터**: 초당 상한 강제(`KIS_RATE_PER_SEC`, 예 8–12/s), **단일 워커 순차·병렬 금지**(20/s는 계좌 공유).
- **토큰**: `kis_token` 단일 행 공유. 요청경로는 토큰을 만지지 않음.
- **멱등성**: 각 데이터셋 `fetch→map→upsert(onConflict)`. 배치 내 PK 중복은 `dedupeByKey`로 제거.

## 5. 읽기 경로 (요청 시 DB만)

```
src/app/api/search/route.ts   # stock where group_code='ST' + name/code ilike, market 'Q'→코스닥
src/data/loader.ts            # getReport(code): price_daily(~63)·fundamental·news(5)·stock 조인
                              # getTrending(): top_view(≤10) ⨝ invest_opinion(존재) → ≤8 ⨝ price_daily
src/data/derive.ts           # 현재가/등락/차트 파생
```
- 리포트 제목·분류는 **코드 임베딩 유지**([`../src/data/report-titles.ts`](../src/data/report-titles.ts), PRD L21).
- **빈 DB 처리**: 첫 수집 전에는 검색/트렌딩/리포트가 빈 상태(안내 문구)로 안전 렌더.

## 5.5 휴대폰 인증 (egress gateway SMS) — 봇 방지 제외

레퍼런스의 SMS 흐름을 따르되 **Turnstile/UA 차단(봇 방지)은 제외**, 발송 남용 방지(쿨다운 30s·시간당 5건)는 유지.

```
src/lib/phone.ts                    # normalizePhone / formatPhone
src/lib/sms/gateway.ts              # sendSms → EGRESS_GATEWAY_URL/KEY (POST /sms, x-api-key)
src/lib/sms/verification.ts         # HMAC(SMS_VERIFICATION_SECRET) hashCode, generateCode, TTL
src/lib/sms/verificationStore.ts    # createVerification / verifyLatestCode / isPhoneVerified / rate-limit
src/app/api/sms/send-code/route.ts  # POST {name,phone} → 게이트웨이 발송 후 code_hash 저장
src/app/api/sms/verify-code/route.ts# POST {phone,code} → 최신행 대조(실패횟수/만료)
```

흐름: 폼에서 `send-code`(SMS 발송) → `verify-code`(검증) → 최종 `submitLead`는 서버에서
`isPhoneVerified(phone)`(최근 10분 내 인증)를 재확인한 뒤에만 `report_request` 저장. 평문 코드는
저장하지 않고 `HMAC-SHA256(phone|code)`만 `phone_verification.code_hash`에 보관.

## 6. 환경 변수 (레퍼런스 [`dotshef/plan-landing`](https://github.com/dotshef/plan-landing) 이름 기준)

> 변수명을 레포와 **정확히 일치**시켜 주입한다. 주의: Supabase URL은 `NEXT_PUBLIC_`이 **아니라 서버 전용** `SUPABASE_URL`이며, KIS의 base URL·rate는 env가 아니라 **코드 상수**(`src/lib/kis/config.ts`)다. 공개(NEXT_PUBLIC) 변수는 Turnstile site key **하나뿐**.

```bash
# --- Supabase (서버 전용) ---
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# --- 한국투자증권 (KIS) ---
KIS_APP_KEY=
KIS_APP_SECRET=
# KIS_BASE_URL / KIS_RATE_PER_SEC 는 env 아님 → config.ts 상수
#   KIS_BASE_URL = https://openapi.koreainvestment.com:9443
#   KIS_RATE_PER_SEC = 12  (백오프 코드 EGW00201, 최대 4회 재시도)

# --- Cron 보호 (/api/cron/ingest) ---
CRON_SECRET=

# --- SMS 발송 (egress gateway) + 인증코드 해시 ---
EGRESS_GATEWAY_URL=
EGRESS_GATEWAY_KEY=
SMS_VERIFICATION_SECRET=        # phone_verification code_hash 시크릿

# --- 리드 알림 메일 (Resend) ---
RESEND_API_KEY=
EMAIL_TO=                       # 리드 알림 수신 주소
```

레포명 기준 매핑(이전 초안 → 확정):
`NEXT_PUBLIC_SUPABASE_URL → SUPABASE_URL`, `VERIFY_PEPPER → SMS_VERIFICATION_SECRET`,
`LEAD_NOTIFY_EMAIL → EMAIL_TO`, `RESEND_FROM`(제거·미사용), `KIS_BASE_URL/KIS_RATE_PER_SEC`(env→상수).
추가 도입: `EGRESS_GATEWAY_URL/KEY`(SMS 발송). **봇 방지(Turnstile)는 도입하지 않음.**

## 7. 단계별 로드맵

| 단계 | 내용 | 산출물 |
|---|---|---|
| **P1 스키마** | §2 DDL로 `0001_init.sql` 재작성(인프라+stock+price_daily+fundamental+news+top_view+invest_opinion) + report_request/phone_verification 승계. **stock 시드는 사용자 적재** | 마이그레이션 |
| **P2 KIS 코어** | `@supabase/supabase-js` 설치 → `db/server`, `kis/config·token·rate-limit·client(kisGet)` | 인증된 KIS 호출 기반 |
| **P3 수집** | `datasets/{shared,stock,market}` + `ingest/{lock,cursor,pump}` + `/api/cron/ingest` | 야간 수집 동작 |
| **P4 읽기 전환** | `data/{loader,derive}`, search·report·trending DB-only, 컴포넌트 연결, **요청시 KIS·mock 제거**, 빈-DB empty state | 요청경로 DB-only |
| **P5 운영** | `vercel.json` cron `*/5 * * * *`, `maxDuration/CHUNK` 튜닝, 로그 요약 확인 | 배포 준비 |

## 8. 기존 코드 정리 (제거/대체)
- 삭제: `stock_prices` 테이블, `src/lib/kis/client.ts`(요청 시 mock), `src/app/api/cron/update-prices`, 중단된 `data/stock.ts`↔`companies.ts` 리네임 잔재.
- `src/lib/supabase.ts`의 `upsertCompanies/upsertStockPrice`는 데이터셋 upsert로 대체. `report_request/phone_verification` 헬퍼는 유지(또는 `db()` 기반으로 이전).

## 9. 참고
- KIS 오픈 API: https://apiportal.koreainvestment.com/
- Next.js Route Handlers / Server Actions / Caching: https://nextjs.org/docs/app
- Supabase JS (server): https://supabase.com/docs/reference/javascript
- Vercel Cron (Pro): https://vercel.com/docs/cron-jobs
- 레퍼런스: https://github.com/dotshef/plan-landing (`db-schema.md`, `lib/kis/*`, `lib/ingest/*`)
