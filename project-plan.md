# 주식 리포트 랜딩 페이지 — 구현 계획 (project-plan.md)

> 본 문서는 [`prd/prd.md`](prd/prd.md) 를 기반으로, **Next.js 최신 버전(App Router)** 과 **KakaoBank Design System** 을 활용한 구현 계획을 정의한다.
> 모든 기술 결정은 Next.js 공식 문서를 근거로 하며, 각 항목에 참고 URL을 명시한다.

---

## 1. 개요 & 목표

세로로 긴 모바일 친화 랜딩 페이지. 방문자가 종목을 검색하면 **한국투자증권(KIS) API** 기반의 리포트 미리보기가 렌더링되고, 핵심 인사이트(한 줄 결론·분석)는 마스킹되어 **하단 신청 폼**을 통한 리드 수집으로 전환을 유도한다.

핵심 지표/후킹 요소:
- 오늘 신청자 수, 이번 주 무료 발송 잔여 수 (실시간 카운트)
- "지금 많이 찾는 종목" TOP 8 Chip
- 검색 → 리포트 미리보기(마스킹) → 신청 폼 전환

---

## 2. 기술 스택

| 영역 | 선택 | 근거 |
|---|---|---|
| 프레임워크 | **Next.js 16.2.x** (App Router, Turbopack 기본) | 최신 안정 버전. 2026-05 기준 16.2.x가 stable, Pages Router는 유지보수 모드 → App Router가 기본. ([Next.js 16 blog](https://nextjs.org/blog/next-16)) |
| 언어 | TypeScript | `create-next-app` 기본값 |
| 런타임/UI | React 19.2 (Server Components) | Next.js 16 번들 |
| 스타일 | Tailwind CSS v4 + CSS 변수(디자인 토큰) | `create-next-app` 기본값 + KakaoBank 토큰 매핑 |
| 폰트 | `next/font/local` (Pretendard OTF) | 로컬 폰트 최적화 |
| DB | **Supabase** (Postgres) | PRD 명시 |
| 이메일 | **Resend** | PRD 명시 (리드 수집) |
| 외부 API | **한국투자증권(KIS) REST API** | PRD 명시 (주가·투자의견·뉴스) |
| 배포 | Vercel (Cron Jobs 포함) | 주가 일일 배치용 |

> **Next.js 최신 버전 근거**: `create-next-app --yes` 기본 셋업은 TypeScript + Tailwind + ESLint + App Router + Turbopack + `@/*` alias + `AGENTS.md` 를 포함한다. ([Installation](https://nextjs.org/docs/app/getting-started/installation))

---

## 3. Next.js 공식 문서 참고 링크 (구현 근거)

| 주제 | 공식 문서 URL |
|---|---|
| 설치 / create-next-app | https://nextjs.org/docs/app/getting-started/installation |
| 프로젝트 구조 | https://nextjs.org/docs/app/getting-started/project-structure |
| 데이터 페칭 (Server Components) | https://nextjs.org/docs/app/getting-started/fetching-data |
| 데이터 변경 (Server Actions / Mutations) | https://nextjs.org/docs/app/getting-started/updating-data |
| Route Handlers (API) | https://nextjs.org/docs/app/api-reference/file-conventions/route |
| 캐싱 / Cache Components (`use cache`) | https://nextjs.org/docs/app/getting-started/caching |
| 폰트 최적화 (`next/font/local`) | https://nextjs.org/docs/app/api-reference/components/font |
| 메타데이터 / SEO | https://nextjs.org/docs/app/getting-started/metadata-and-og-images |
| 환경 변수 | https://nextjs.org/docs/app/guides/environment-variables |
| `next.config` 설정 | https://nextjs.org/docs/app/api-reference/config/next-config-js |
| Next.js 16 릴리스 노트 | https://nextjs.org/blog/next-16 |
| Vercel Cron Jobs (일일 배치) | https://vercel.com/docs/cron-jobs |

외부 연동 문서:
- Supabase + Next.js (SSR): https://supabase.com/docs/guides/auth/server-side/nextjs
- Resend + Next.js: https://resend.com/docs/send-with-nextjs
- 한국투자증권 오픈 API 포털: https://apiportal.koreainvestment.com/

---

## 4. 프로젝트 구조 (제안)

앱 코드는 Next.js 공식 `src/` 컨벤션으로 모은다. `public/`·설정 파일·`supabase/`
마이그레이션은 규칙상 루트에 둔다. import alias `@/*` → `./src/*`.

```
a-company-landing-2/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # 루트 레이아웃 (폰트/토큰/메타데이터)
│   │   ├── page.tsx                   # 랜딩 페이지 (Server Component)
│   │   ├── fonts.ts                   # Pretendard next/font/local
│   │   ├── globals.css                # KakaoBank 토큰 + Tailwind
│   │   ├── actions/
│   │   │   └── lead.ts                # 'use server' — 리드 저장 + Resend / SMS 인증
│   │   └── api/
│   │       ├── search/route.ts        # 종목 검색 (2,651개사)
│   │       ├── report/[code]/route.ts # 리포트 미리보기 데이터
│   │       └── cron/
│   │           └── update-prices/route.ts  # 매일 낮 12시 주가 배치 (chunk 20)
│   ├── components/
│   │   ├── design-system/             # KakaoBank 프리미티브 포팅 (Button/Card/Chip/StatusPill/Icon)
│   │   ├── landing/                   # Hero, StatsBar, TrendingChips, SearchBox, LeadForm, LandingClient
│   │   └── report/                    # ReportPreview, PriceChart
│   ├── lib/
│   │   ├── kis/client.ts              # 한국투자증권 API 클라이언트 (토큰/현재가/뉴스/투자의견)
│   │   ├── supabase.ts                # server 전용 REST 헬퍼 (service_role)
│   │   ├── resend.ts                  # 리드 알림 메일
│   │   ├── report.ts · stats.ts · format.ts · types.ts
│   └── data/
│       ├── companies.ts               # 2,651개사 마스터 (코드/시장/산업)
│       └── report-titles.ts           # 5,302개 임베딩 제목 + 분류 (코드 임베딩, DB 미저장)
├── supabase/
│   └── migrations/0001_init.sql       # companies / stock_prices(FK) / report_request / phone_verification + RLS
├── public/fonts/                      # Pretendard OTF (디자인 시스템에서 복사)
├── vercel.json                        # Cron (매일 낮 12시 KST)
├── .env.example
└── project-plan.md
```

> 근거: [Project structure — src directory](https://nextjs.org/docs/app/getting-started/project-structure), [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)

---

## 5. KakaoBank Design System 통합

디자인 시스템 원본: [`KakaoBank Design System/`](KakaoBank%20Design%20System/) (README.md / colors_and_type.css / ui_kits).

### 5.1 토큰
- `KakaoBank Design System/colors_and_type.css` 의 `:root` CSS 변수를 `app/globals.css` 로 이식.
- **The one yellow `#FFE300`** 만 브랜드 컬러 (틴트/셰이드 금지). Near-black `#1E1E1E` (순수 검정 금지).
- 반경 12px 기본, 아바타는 원형이 아닌 **12px 라운드 스퀘어**.
- Tailwind v4 `@theme` 에 토큰을 매핑해 유틸리티로도 사용.

### 5.2 폰트 (Pretendard)
- `fonts/*.otf` (100–900) → `public/fonts/` 복사 후 `next/font/local` 로 로드.
  근거: [next/font](https://nextjs.org/docs/app/api-reference/components/font)

```ts
// app/fonts.ts (예시)
import localFont from 'next/font/local'
export const pretendard = localFont({
  src: [
    { path: '../public/fonts/Pretendard-Regular.otf',  weight: '400' },
    { path: '../public/fonts/Pretendard-SemiBold.otf', weight: '600' },
    { path: '../public/fonts/Pretendard-Bold.otf',     weight: '700' },
    { path: '../public/fonts/Pretendard-ExtraBold.otf', weight: '800' },
  ],
  variable: '--font-pretendard', display: 'swap',
})
```

### 5.3 컴포넌트 포팅
- `ui_kits/mobile-app/Components.jsx` 의 `KBButton / KBCard / KBAvatar / StatusPill / Icon` 은 현재 **window 전역 + 인라인 스타일** 방식 → **React 컴포넌트(TSX)** 로 재작성하여 `components/design-system/` 에 배치.
- 인터랙션 상태(눌림 시 opacity 0.85, 성공 시에만 spring, `prefers-reduced-motion` 준수) 규칙 유지.
- 아이콘은 Lucide 대체 표기 유지(README의 "substitution" 플래그 존중).

### 5.4 보이스/카피
- 해요체, CTA는 동사(`신청하기`, `확인`), 마케팅 최상급(`혁신적인`·`최고의`) 금지, UI chrome에 이모지 금지 — README "CONTENT FUNDAMENTALS" 준수.

---

## 6. 페이지 & 컴포넌트 구성 (PRD 매핑)

단일 라우트 `/` 의 세로 스크롤 구성 (모바일 우선, `max-width` 컬럼):

| 순서 | 섹션 | PRD 근거 | 렌더링 |
|---|---|---|---|
| 1 | Hero | 모바일 친화 세로 UI | Server |
| 2 | **StatsBar** — 오늘 신청자 수 / 이번 주 무료 발송 잔여 | prd L4 | Server(초기값)+Client(폴링) |
| 3 | **TrendingChips** — 지금 많이 찾는 종목 TOP 8 | prd L5 | Server (KIS 투자의견) |
| 4 | **SearchBox** — 검색 → 리포트 미리보기 | prd L6–7 | Client + Route Handler |
| 5 | **Report Preview** — 상단(주가/차트) + 하단(제목/분류/뉴스) | prd L8–22 | Server/Client 혼합 |
| 6 | **LeadForm** — SMS 인증 + 리드 신청 (하단 고정 CTA) | prd L3, L24–25, L28 | Server Action |

### 6.1 리포트 미리보기 상세
- **헤더**: 기업 마크 없이 회사명만. 종목번호·거래시장·산업 표기. (prd L9–10)
- **상단**: 현재가/고가/저가/52주 최고·최저 + **3개월 주가 차트**. (prd L11–14)
  - 차트는 경량 라이브러리(예: Recharts) 또는 SVG 스파크라인으로 렌더.
- **하단**: 리포트 제목(질문, "~일까?") + AI 분류 + 종목당 뉴스 5개. (prd L15–20)
- **마스킹**: 한 줄 결론·분석결과는 블러/그라데이션 마스킹 → 신청 유도. (prd L22)

---

## 7. 데이터 계층

### 7.1 Supabase 스키마 (PRD L23–27 · `supabase/migrations/0001_init.sql`)
| 테이블 | 용도 | 갱신 |
|---|---|---|
| `companies` | 종목 마스터 (KIS 기반 실제 회사정보) — code PK | KIS 동기화 시 upsert |
| `stock_prices` | 현재가/고가/저가/52주/차트 스냅샷 — **`companies(code)` FK 참조** | **매일 업데이트** (cron upsert) |
| `report_request` | 리포트 신청 기록(리드) + 유입/광고 트래킹 | insert |
| `phone_verification` | 휴대폰 인증 — 평문 대신 `code_hash`, 만료/실패횟수 관리 | insert/update |

- 모든 시각 컬럼은 **KST(`now() AT TIME ZONE 'Asia/Seoul'`)** 로 기록.
- 서버 측 접근은 REST(PostgREST) + 서버 전용 `service_role` 키. 근거: https://supabase.com/docs/guides/auth/server-side/nextjs
- **RLS 전체 활성화**. anon/authenticated에는 정책 미부여 → service_role(RLS 우회)로만 접근.
- 코드의 `COMPANIES` 상수는 `companies` 테이블의 시드/폴백이며, 운영 시 KIS 종목정보 API로 테이블을 채운다.

### 7.2 코드 임베딩 데이터
- **`data/companies.ts`**: 코스피 833 + 코스닥 1,818 = **2,651개사** (코드/시장/산업). (prd L7)
- **`data/report-titles.ts`**: 회사당 2개 × 2,651 = **5,302개 제목**(의문문) + 분류. **DB 미저장, 코드 임베딩**. (prd L19–21)
  - 개발 시 멀티 에이전트로 1차(제목 생성)·2차(분류) 작업하여 정적 파일로 생성.

### 7.3 KIS API 연동 (`lib/kis/`)
- OAuth 접근토큰 발급/갱신, 현재가 시세, 투자의견 종목, 뉴스 5건 수집.
- 참고: https://apiportal.koreainvestment.com/
- 서버 전용. 토큰/앱키는 환경변수로만 주입.

---

## 8. 서버 로직 (Next.js 기능 매핑)

| 기능 | Next.js 수단 | 근거 문서 |
|---|---|---|
| 종목 검색 | Route Handler `app/api/search/route.ts` | [route](https://nextjs.org/docs/app/api-reference/file-conventions/route) |
| 리포트 미리보기 로드 | Server Component `fetch` + `use cache` | [fetching-data](https://nextjs.org/docs/app/getting-started/fetching-data), [caching](https://nextjs.org/docs/app/getting-started/caching) |
| 리드/ SMS 저장 + 이메일 | **Server Action** (`'use server'`) + `revalidatePath` | [updating-data](https://nextjs.org/docs/app/getting-started/updating-data) |
| 주가 일일 배치(낮 12시 KST, 20개 chunk) | Route Handler + **Vercel Cron** | [cron-jobs](https://vercel.com/docs/cron-jobs) |
| 통계 카운트 | Server 초기값 + Client 폴링(`refresh()`/재검증) | [caching](https://nextjs.org/docs/app/getting-started/caching) |

> **리드 폼**: `<form action={submitLead}>` 형태의 Server Action + Zod 검증. 성공 시 Resend로 발송. 근거: [updating-data](https://nextjs.org/docs/app/getting-started/updating-data), [Resend](https://resend.com/docs/send-with-nextjs)

### 8.1 주가 일일 배치 (prd L13)
- `vercel.json` 의 `crons` 로 매일 낮 12시(KST) 트리거 → `app/api/cron/update-prices/route.ts`. (Vercel Cron은 UTC 기준: 12:00 KST = 03:00 UTC → `0 3 * * *`)
- 2,651개사를 **20개 chunk 단위**로 순회하여 KIS rate limit 회피 후 `stock_prices` upsert.

---

## 9. 환경 변수 (`.env.local`)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 한국투자증권 KIS
KIS_APP_KEY=
KIS_APP_SECRET=
KIS_ACCOUNT=

# Resend
RESEND_API_KEY=
LEAD_NOTIFY_EMAIL=

# Cron 보호
CRON_SECRET=
```
> 근거: [Environment Variables](https://nextjs.org/docs/app/guides/environment-variables). `NEXT_PUBLIC_` 접두사만 브라우저 노출, 나머지는 서버 전용.

---

## 10. 구현 단계별 로드맵

| 단계 | 내용 | 산출물 |
|---|---|---|
| **P0. 스캐폴딩** | `npx create-next-app@latest` (TS/Tailwind/App Router/Turbopack) | 실행 가능한 빈 앱 |
| **P1. 디자인 시스템** | 토큰 이식, Pretendard `next/font/local`, DS 컴포넌트 TSX 포팅 | `components/design-system/` |
| **P2. 정적 데이터** | `companies.ts`(2,651) + `report-titles.ts`(5,302, AI 생성) | 검색·리포트 기반 데이터 |
| **P3. 랜딩 UI** | Hero/StatsBar/TrendingChips/SearchBox/LeadForm 조립 | `/` 페이지 |
| **P4. KIS 연동** | 시세/투자의견/뉴스 클라이언트 + 리포트 미리보기(마스킹) | 리포트 렌더 |
| **P5. Supabase + Resend** | 스키마/RLS, 리드·SMS Server Action, 이메일 발송 | 전환 파이프라인 |
| **P6. 배치/운영** | Vercel Cron 주가 업데이트(낮 12시 KST, chunk 20), 통계 카운트 | 자동 갱신 |
| **P7. 마감** | SEO 메타데이터, 접근성, `prefers-reduced-motion`, 성능 점검 | 배포 준비 |

---

## 11. 리스크 & 확인 필요 사항

- **KIS API 레이트리밋/실서버 스펙**: chunk 크기(20)·낮 12시 스케줄이 실제 한도와 부합하는지 검증 필요. (PRD 원문은 18시였으나 낮 12시로 변경됨)
- **SMS 인증 공급자**: PRD는 "SMS 인증 요청 저장"만 명시 — 실제 발송 공급자(예: NHN/알리고 등) 미지정 → 결정 필요.
- **5,302개 제목 생성 파이프라인**: 멀티 에이전트 1차/2차 작업의 실행 시점·검수 기준.
- **마스킹 UX 수위**: 블러 강도/노출 범위(전환율 vs 정보 제공 균형).

---

### 참고 링크 총정리
- Next.js Docs: https://nextjs.org/docs · Next.js 16: https://nextjs.org/blog/next-16
- Supabase: https://supabase.com/docs/guides/auth/server-side/nextjs
- Resend: https://resend.com/docs/send-with-nextjs
- 한국투자증권 오픈 API: https://apiportal.koreainvestment.com/
- Vercel Cron: https://vercel.com/docs/cron-jobs
- KakaoBank Design System: [`./KakaoBank Design System/README.md`](KakaoBank%20Design%20System/README.md)
