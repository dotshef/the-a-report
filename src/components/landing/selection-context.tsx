"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Stock } from "@/data/stock";
import type { ReportData, TrendingStock } from "@/lib/types";

// 종목 선택 → 리포트 미리보기 → 신청 흐름의 공유 상태.
// 인풋(칩·검색)과 아웃풋(리포트·CTA) 섹션이 이 컨텍스트로 상태를 나눠 가진다.
type SelectionContextValue = {
  trending: TrendingStock[];
  selected: Stock | null;
  report: ReportData | null;
  loading: boolean;
  loadReport: (stock: Stock) => void;
  selectByCode: (code: string) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection must be used within <SelectionProvider>");
  }
  return ctx;
}

export function SelectionProvider({
  trending,
  children,
}: {
  trending: TrendingStock[];
  children: ReactNode;
}) {
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

  return (
    <SelectionContext.Provider
      value={{
        trending,
        selected,
        report,
        loading,
        loadReport,
        selectByCode,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}
