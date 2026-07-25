"use client";

import { TrendingChips } from "./TrendingChips";
import { useSelection } from "./selection-context";

// 지금 많이 찾는 종목 칩 — 선택 시 리포트를 불러온다.
export function TrendingSection() {
  const { trending, selected, selectByCode } = useSelection();
  return (
    <TrendingChips
      items={trending}
      activeCode={selected?.code}
      onSelect={selectByCode}
    />
  );
}
