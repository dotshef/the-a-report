"use client";

import type { TrendingStock } from "@/lib/types";
import { Chip } from "@/components/design-system/primitives";

// 지금 많이 찾는 종목 — 투자의견 보유 종목 TOP 8 (PRD L5).
export function TrendingChips({
  items,
  activeCode,
  onSelect,
}: {
  items: TrendingStock[];
  activeCode?: string;
  onSelect: (code: string) => void;
}) {
  return (
    <section className="flex flex-col gap-3 px-5">
      <div className="flex items-center gap-1.5">
        <span className="text-base leading-none" aria-hidden="true">
          🔥
        </span>
        <h2 className="text-sm font-semibold">지금 많이 찾는 종목</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((t) => (
          <Chip
            key={t.stock.code}
            active={activeCode === t.stock.code}
            onClick={() => onSelect(t.stock.code)}
          >
            {t.stock.name}
          </Chip>
        ))}
      </div>
    </section>
  );
}
