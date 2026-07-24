"use client";

import { useCallback, useState } from "react";
import type { Stock } from "@/data/stock";
import type { ReportData, TrendingStock } from "@/lib/types";
import { TrendingChips } from "./TrendingChips";
import { SearchBox } from "./SearchBox";
import { LeadForm } from "./LeadForm";
import { ReportPreview } from "@/components/report/ReportPreview";

// 검색/칩 → 리포트 미리보기 → 신청 폼 전환을 하나로 묶는 클라이언트 오케스트레이터.
export function LandingClient({ trending }: { trending: TrendingStock[] }) {
  const [selected, setSelected] = useState<Stock | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadReport = useCallback(async (stock: Stock) => {
    setSelected(stock);
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch(`/api/report/${stock.code}`);
      if (res.ok) setReport((await res.json()) as ReportData);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectByCode = useCallback(
    (code: string) => {
      const t = trending.find((x) => x.stock.code === code);
      if (t) void loadReport(t.stock);
    },
    [trending, loadReport],
  );

  const scrollToApply = useCallback(() => {
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <TrendingChips items={trending} activeCode={selected?.code} onSelect={selectByCode} />
      <SearchBox onSelect={loadReport} />

      {loading && (
        <div className="px-5">
          <div className="h-40 animate-pulse rounded-[12px] bg-kb-fill" />
        </div>
      )}

      {report && !loading && (
        <div className="px-5">
          <ReportPreview report={report} onApply={scrollToApply} />
        </div>
      )}

      <LeadForm selectedCode={selected?.code} selectedName={selected?.name} />
    </>
  );
}
