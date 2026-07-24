"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { Stock } from "@/data/stock";
import type { LandingStats } from "@/lib/stats";
import type { ReportData, TrendingStock } from "@/lib/types";
import { Hero } from "./Hero";
import { StatsBar } from "./StatsBar";
import { TrendingChips } from "./TrendingChips";
import { SearchBox } from "./SearchBox";
import { ReportPreview } from "@/components/report/ReportPreview";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import { Button } from "@/components/design-system/Button";
import { Icon } from "@/components/design-system/Icon";

// 레퍼런스 2단계 흐름: (1) 종목 선택·미리보기 → 버튼 → (2) /request 신청 폼.
export function LandingClient({
  trending,
  stats,
}: {
  trending: TrendingStock[];
  stats: LandingStats;
}) {
  const router = useRouter();
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

  const goToRequest = useCallback(() => {
    if (!selected) return;
    const params = new URLSearchParams({
      code: selected.code,
      name: selected.name,
    });
    router.push(`/request?${params.toString()}`);
  }, [router, selected]);

  return (
    <>
      <Hero />
      <StatsBar stats={stats} />
      <TrendingChips
        items={trending}
        activeCode={selected?.code}
        onSelect={selectByCode}
      />
      <SearchBox onSelect={loadReport} />

      {loading && (
        <div className="px-5">
          <ReportSkeleton />
        </div>
      )}

      {report && !loading && (
        <div key={report.stock.code} className="kb-reveal px-5">
          <ReportPreview report={report} />
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button
          fullWidth
          disabled={!selected}
          onClick={goToRequest}
          className="relative h-14 overflow-hidden text-[17px] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[160%] before:skew-x-[-22deg] before:bg-gradient-to-r before:from-transparent before:via-white/45 before:to-transparent before:transition-transform before:duration-700 before:ease-out enabled:hover:before:translate-x-[420%]"
        >
          <Icon
            name="lock"
            size={18}
            color={selected ? "var(--kb-black)" : "var(--kb-light-gray)"}
          />
          전체 리포트 무료로 받기 →
        </Button>
        <p className="text-center text-xs text-kb-gray">
          종목 선택·미리보기만으로는 어떤 비용도 발생하지 않습니다.
        </p>
      </div>
    </>
  );
}
