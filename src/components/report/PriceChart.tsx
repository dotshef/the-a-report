export function PriceChart({
  history,
  up,
}: {
  history: { date: string; close: number }[];
  up: boolean;
}) {
  const w = 320;
  const h = 96;
  const pad = 4;
  const closes = history.map((d) => d.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const n = closes.length;

  const x = (i: number) => pad + (i / (n - 1)) * (w - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / range) * (h - pad * 2);

  const line = closes.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)},${h - pad} L${x(0).toFixed(1)},${h - pad} Z`;

  const stroke = up ? "var(--kb-critical)" : "var(--kb-link-blue)";
  const gradId = up ? "g-up" : "g-down";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-24 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="3개월 주가 추이"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
