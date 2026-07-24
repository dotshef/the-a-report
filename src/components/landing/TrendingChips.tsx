"use client";

import type { TrendingStock } from "@/lib/types";
import { Chip } from "@/components/design-system/primitives";
import { Icon } from "@/components/design-system/Icon";
import { pct } from "@/lib/format";

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
        <Icon name="sparkle" size={16} color="var(--kb-black)" />
        <h2 className="text-sm font-semibold">지금 많이 찾는 종목</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((t) => (
          <Chip
            key={t.stock.code}
            active={activeCode === t.stock.code}
            onClick={() => onSelect(t.stock.code)}
          >
            {t.stock.name}
            <span
              className={
                activeCode === t.stock.code
                  ? "text-kb-white/70"
                  : t.changeRate > 0
                    ? "text-price-up"
                    : "text-price-down"
              }
            >
              {pct(t.changeRate)}
            </span>
          </Chip>
        ))}
      </div>
    </section>
  );
}
