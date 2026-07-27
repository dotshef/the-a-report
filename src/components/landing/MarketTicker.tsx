import type { TickerData, TickerItem } from "@/lib/types";
import { won, pct } from "@/lib/format";

// 헤더 위 시세 티커 — top_view 종목의 종목명·주가·등락률이 좌로 흐른다.
// 트랙을 두 벌 이어 붙이고 -50%까지 이동시켜 끊김 없이 반복한다(두 번째 벌은 aria-hidden).
// 값은 price_daily의 확정 종가 기준(장중 갱신 없음)이라 기준 거래일을 앞머리에 붙인다.
// date 문자열을 그대로 쪼갠다 — Date로 파싱하면 서버(UTC)에서 하루 밀린다.
function asOfLabel(asOf: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(asOf);
  return m ? `${Number(m[2])}월 ${Number(m[3])}일 종가 기준` : "";
}

function Row({
  items,
  asOf,
  ariaHidden,
}: {
  items: TickerItem[];
  asOf: string;
  ariaHidden?: boolean;
}) {
  const label = asOf ? asOfLabel(asOf) : "";
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {label && (
        <span className="mr-6 inline-flex shrink-0 items-center rounded-full bg-brand-surface px-2 py-0.5 text-[11px] font-bold text-brand-strong">
          {label}
        </span>
      )}
      {items.map((it) => {
        const dir = it.changeRate > 0 ? "up" : it.changeRate < 0 ? "down" : "flat";
        return (
          <span
            key={it.code}
            className="inline-flex shrink-0 items-center gap-1.5 pr-6 text-[12px] text-kb-cool-gray [font-variant-numeric:tabular-nums]"
          >
            <b className="font-bold text-kb-black">{it.name}</b>
            <span>{won(it.price)}</span>
            <em
              className={`font-bold not-italic ${
                dir === "up"
                  ? "text-price-up"
                  : dir === "down"
                    ? "text-price-down"
                    : "text-kb-gray"
              }`}
            >
              {pct(it.changeRate)}
            </em>
          </span>
        );
      })}
    </div>
  );
}

export function MarketTicker({ data }: { data: TickerData }) {
  const { items, asOf } = data;
  // 데이터가 없으면 빈 바를 남기지 않고 아예 렌더하지 않는다.
  if (items.length === 0) return null;

  return (
    <div
      className="kb-ticker h-[34px] overflow-hidden border-b border-kb-border bg-kb-subtle"
      aria-label="주요 종목 시세"
    >
      <div className="mx-auto h-full w-full max-w-[480px] overflow-hidden px-5">
        <div className="kb-ticker-track flex h-full items-center">
          <Row items={items} asOf={asOf} />
          <Row items={items} asOf={asOf} ariaHidden />
        </div>
      </div>
    </div>
  );
}
