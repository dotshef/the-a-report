import { SiteHeader } from "@/components/landing/SiteHeader";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { SelectionProvider } from "@/components/landing/selection-context";
import { ApplySection } from "@/components/landing/ApplySection";
import { ReportSection } from "@/components/landing/ReportSection";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { StickyBar } from "@/components/landing/StickyBar";
import { getTicker, getTrending } from "@/data/loader";
import { getStats } from "@/lib/stats";
import {
  resolveSearchKeyword,
  type SearchParamsInput,
} from "@/lib/naver-keyword";

// 세로로 긴 모바일 친화 랜딩 (PRD L2). 매 요청마다 시세/통계 갱신.
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const [trending, ticker, stats, query] = await Promise.all([
    getTrending(8),
    getTicker(12),
    Promise.resolve(getStats()),
    searchParams,
  ]);

  // 네이버 유입 키워드 (n_keyword 등) — 히어로 상단 배지에 사용
  const keyword = resolveSearchKeyword(query);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* 시세 티커 — 헤더 위 전폭 바. top_view 종목의 주가/등락률이 좌로 흐른다 */}
      <MarketTicker data={ticker} />

      {/* 헤더 바 — 뷰포트 전폭 (하단 고정바와 동일) */}
      <SiteHeader />

      {/* 배경은 body의 단일 그라데이션 하나만 쓴다 (섹션별 배경 없음) */}
      <main className="mx-auto flex w-full max-w-[480px] flex-col gap-8 pb-[calc(96px+env(safe-area-inset-bottom))]">
        <Hero keyword={keyword} />
        <StatsBar stats={stats} />

        {/* 인터랙티브 섹션 — 종목 선택 상태를 공유하는 클라이언트 경계 */}
        <SelectionProvider trending={trending}>
          <ApplySection />
          <ReportSection />

          {/* 하단 고정바 — 선택 종목을 들고 리포트 신청 페이지로 이동 */}
          <StickyBar />
        </SelectionProvider>

        <SiteFooter />
      </main>
    </div>
  );
}
