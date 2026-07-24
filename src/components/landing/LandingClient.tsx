"use client";

import { useCallback, useState } from "react";
import type { Stock } from "@/data/stock";
import type { LandingStats } from "@/lib/stats";
import type { ReportData, TrendingStock } from "@/lib/types";
import { Hero } from "./Hero";
import { StatsBar } from "./StatsBar";
import { TrendingChips } from "./TrendingChips";
import { SearchBox } from "./SearchBox";
import { LeadForm } from "./LeadForm";
import { ReportPreview } from "@/components/report/ReportPreview";
import { Button } from "@/components/design-system/Button";
import { Icon } from "@/components/design-system/Icon";

// 레퍼런스 2단계 흐름: (1) 종목 선택·미리보기 → 버튼 → (2) 신청 폼.
export function LandingClient({
  trending,
  stats,
}: {
  trending: TrendingStock[];
  stats: LandingStats;
}) {
  const [step, setStep] = useState<"select" | "apply">("select");
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

  // ── STEP 2: 신청 폼 ──
  if (step === "apply") {
    return (
      <LeadForm
        selectedCode={selected?.code}
        selectedName={selected?.name}
        onBack={() => setStep("select")}
      />
    );
  }

  // ── STEP 1: 종목 선택 ──
  return (
    <>
      <Hero />
      <StatsBar stats={stats} />
      <TrendingChips items={trending} activeCode={selected?.code} onSelect={selectByCode} />
      <SearchBox onSelect={loadReport} />

      {loading && (
        <div className="px-5">
          <div className="h-40 animate-pulse rounded-[12px] bg-kb-fill" />
        </div>
      )}

      {report && !loading && (
        <div className="px-5">
          <ReportPreview report={report} />
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button
          fullWidth
          disabled={!selected}
          onClick={() => setStep("apply")}
          className="h-14 text-[17px]"
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
