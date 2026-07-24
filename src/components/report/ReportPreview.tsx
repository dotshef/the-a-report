"use client";

import type { ReportData } from "@/lib/types";
import { marketLabel } from "@/data/stock";
import { won, signed, pct } from "@/lib/format";
import { Card, StatusPill } from "@/components/design-system/primitives";
import { Icon } from "@/components/design-system/Icon";
import { Button } from "@/components/design-system/Button";
import { PriceChart } from "./PriceChart";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-kb-gray">{label}</span>
      <span className="amount text-sm">{value}</span>
    </div>
  );
}

export function ReportPreview({
  report,
  onApply,
}: {
  report: ReportData;
  onApply: () => void;
}) {
  const { stock, quote, sections } = report;
  const up = quote.change > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ── 리포트 상단: 헤더 + 시세 + 차트 ── */}
      <Card className="!p-0 overflow-hidden">
        {/* 헤더 — 기업 마크 없이 회사명만 (PRD L9) */}
        <div className="border-b border-kb-border p-5">
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold">{stock.name}</h3>
            <span className="text-sm text-kb-gray">{stock.code}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-kb-gray">
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
            <span className="text-xs text-kb-gray">
              {new Date(quote.updatedAt).toLocaleString("ko-KR", {
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              기준
            </span>
          </div>
        </div>

        {/* 3개월 차트 */}
        <div className="px-3 pt-3">
          <PriceChart history={quote.history} up={up} />
        </div>

        {/* 고가/저가/52주 */}
        <div className="grid grid-cols-4 gap-2 p-5 pt-3">
          <Stat label="고가" value={won(quote.high)} />
          <Stat label="저가" value={won(quote.low)} />
          <Stat label="52주 최고" value={won(quote.high52w)} />
          <Stat label="52주 최저" value={won(quote.low52w)} />
        </div>
      </Card>

      {/* ── 리포트 하단: 제목/분류 + 마스킹 결론·분석 + 뉴스 ── */}
      {sections.map((s, i) => (
        <Card key={i} className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-base font-semibold leading-snug">{s.title}</h4>
            <StatusPill tone="neutral">{s.category}</StatusPill>
          </div>

          {/* 한 줄 결론 / 분석 결과 — 마스킹 (PRD L22) */}
          <div className="relative overflow-hidden rounded-[12px] bg-kb-subtle p-4">
            <p className="kb-mask text-sm leading-relaxed">{s.conclusion}</p>
            <p className="kb-mask mt-2 text-sm leading-relaxed text-kb-gray">{s.analysis}</p>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white/40">
              <Icon name="lock" size={20} color="var(--kb-gray)" />
              <span className="text-xs font-semibold text-kb-gray">
                한 줄 결론과 분석은 신청 후 공개돼요
              </span>
            </div>
          </div>

          {/* 종목 뉴스 (PRD L18) */}
          {s.news.length > 0 && (
            <ul className="flex flex-col divide-y divide-kb-border">
              {s.news.map((n, j) => (
                <li key={j} className="flex items-center gap-2.5 py-2.5">
                  <Icon name="news" size={16} color="var(--kb-gray)" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{n.title}</p>
                    <p className="text-xs text-kb-gray">
                      {n.source} · {n.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}

      <Button fullWidth onClick={onApply}>
        지금 무료로 전체 리포트 받기
      </Button>
    </div>
  );
}
