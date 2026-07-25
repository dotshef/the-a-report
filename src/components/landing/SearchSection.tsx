"use client";

import { SearchBox } from "./SearchBox";
import { useSelection } from "./selection-context";

// 종목 검색 — 선택 시 리포트를 불러온다.
export function SearchSection() {
  const { loadReport } = useSelection();
  return <SearchBox onSelect={loadReport} />;
}
