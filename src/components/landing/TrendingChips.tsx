"use client";

import type { TrendingStock } from "@/lib/types";
import { Chip } from "@/components/design-system/primitives";

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
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5">
        <span className="text-base leading-none" aria-hidden="true">
          🔥
        </span>
        <h3 className="text-[13px] font-semibold text-kb-cool-gray">
          지금 많이 찾는 종목
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
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
    </div>
  );
}
