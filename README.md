# 에이주식연구소 랜딩페이지

코스피·코스닥 2,651개 종목의 주가와 AI 리포트를 검색하고, 매일 무료 리포트를 신청받는 모바일 친화형 랜딩페이지입니다. **KakaoBank 디자인 시스템** 토큰을 기반으로 합니다.

## 기술 스택

- **Next.js 16** (App Router) / **React 19** / **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — 데이터 저장 (서버 서비스롤 전용, RLS 미사용 v1)
- **한국투자증권(KIS) API** — 주가·투자의견·뉴스 수집
- **Vercel Cron** — 야간 데이터 적재
- **Resend** — 리드 알림 메일 / **SMS 게이트웨이** — 휴대폰 인증

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

빌드:

```bash
npm run build && npm run start
```

## 데이터 흐름

```
KIS API → Vercel Cron(/api/cron/ingest) → Supabase → 클라이언트(항상 DB만 읽음)
```

## 참고사항

- 리포트 신청 고객 정보(리드)는 Supabase `report_request` 테이블에 저장되며, Resend로 알림 메일이 발송됩니다.
- 휴대폰 인증 요청은 `phone_verification` 테이블에 저장됩니다. 평문 코드는 저장하지 않고 SHA-256 해시(`code_hash`)만 보관합니다.
- 리포트 제목·분류는 DB가 아니라 코드에 임베딩되어 있습니다 (`src/data/report-titles.ts`, 업데이트 X).
- "한 줄 결론"과 분석 결과는 마스킹 처리됩니다.
