"use client";

import { ReportPreview } from "@/components/report/ReportPreview";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import { SectionHeading } from "./SectionHeading";
import { SearchBox } from "./SearchBox";
import { TrendingChips } from "./TrendingChips";
import { useSelection } from "./selection-context";

// ② 분석 리포트 선택 & 미리보기 — 인기 칩·종목 검색으로 고르면
// 종목당 리포트 2건(시세 카드 + 리포트 카드 2장)을 보여준다.
export function ReportSection() {
  const { trending, selected, report, loading, selectByCode, loadReport } =
    useSelection();

  return (
    <section className="flex flex-col gap-4 px-5">
      <SectionHeading step={2}>분석 리포트 선택 &amp; 미리보기</SectionHeading>

      {/* 종목 선택 — 인기 칩 + 종목명/코드 검색 */}
      <div className="flex flex-col gap-4 rounded-[16px] border border-kb-border bg-kb-white p-5">
        <TrendingChips
          items={trending}
          activeCode={selected?.code}
          onSelect={selectByCode}
        />
        <SearchBox onSelect={loadReport} />
      </div>

      {loading ? (
        <ReportSkeleton />
      ) : report ? (
        <div key={report.stock.code} className="kb-reveal">
          <ReportPreview report={report} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 rounded-[16px] border border-dashed border-kb-light-gray bg-white/60 px-5 py-10 text-center">
          <p className="text-sm font-semibold">
            종목을 선택하면 리포트 2건을 미리 보여드려요
          </p>
          <p className="text-xs text-kb-gray">
            인기 종목을 누르거나 종목명·코드로 검색해 보세요.
          </p>
        </div>
      )}
    </section>
  );
}
