"use client";

import type { ReportData } from "@/lib/types";
import { marketLabel } from "@/data/stock";
import { won, signed, pct } from "@/lib/format";
import { Card } from "@/components/design-system/primitives";
import { Icon } from "@/components/design-system/Icon";
import { PriceChart } from "./PriceChart";

function Stat({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-kb-gray">{label}</span>
      <span className={`amount text-sm ${valueClassName}`}>{value}</span>
    </div>
  );
}

export function ReportPreview({ report }: { report: ReportData }) {
  const { stock, quote, sections } = report;
  const up = quote.change > 0;

  return (
    <div className="flex flex-col gap-4">
      <Card className="!p-0 overflow-hidden">
        <div
          className="border-b border-kb-border p-5 text-kb-white"
          style={{ background: "#1a1f2e" }}
        >
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold">{stock.name}</h3>
            <span className="text-sm text-kb-light-gray">{stock.code}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-kb-light-gray">
            <span>{marketLabel(stock.market)}</span>
            {stock.industry && (
              <>
                <span aria-hidden>·</span>
                <span>{stock.industry}</span>
              </>
            )}
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="amount text-3xl">{won(quote.price)}원</div>
              <div
                className={`mt-1 text-sm font-semibold ${up ? "text-price-up" : "text-price-down"}`}
              >
                {signed(quote.change)}원 ({pct(quote.changeRate)})
              </div>
            </div>
            {quote.updatedAt && (
              <span className="text-xs text-kb-light-gray">
                {new Date(quote.updatedAt).toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                기준
              </span>
            )}
          </div>
        </div>

        <div className="px-3 pt-3">
          <PriceChart history={quote.history} up={up} />
        </div>

        <div className="grid grid-cols-4 gap-2 p-5 pt-3">
          <Stat label="고가" value={won(quote.high)} valueClassName="text-price-up" />
          <Stat label="저가" value={won(quote.low)} valueClassName="text-price-down" />
          <Stat label="52주 최고" value={won(quote.high52w)} />
          <Stat label="52주 최저" value={won(quote.low52w)} />
        </div>
      </Card>

      {sections.map((s, i) => (
        <Card key={i} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-brand-strong">{s.category}</span>
            <h4 className="text-base font-semibold leading-snug">{s.title}</h4>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold text-kb-white"
              style={{ background: "var(--brand-primary)" }}
            >
              한줄 결론
            </span>
            <div className="relative flex-1 overflow-hidden rounded-[8px] bg-kb-subtle px-3 py-2">
              <p className="kb-mask truncate text-sm leading-relaxed">{s.conclusion}</p>
              <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                <Icon name="lock" size={16} color="var(--kb-gray)" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-kb-gray">분석 결과 (요약)</span>
            <div className="relative overflow-hidden rounded-[12px] bg-kb-subtle p-4">
              <p className="kb-mask text-sm leading-relaxed text-kb-gray">{s.analysis}</p>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white/40">
                <Icon name="lock" size={20} color="var(--kb-gray)" />
                <span className="text-xs font-semibold text-kb-gray">
                  신청 후 공개돼요
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
