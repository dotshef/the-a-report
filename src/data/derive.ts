// 파생값 계산 — 저장하지 않고 읽기 시 계산.

export function changeFromCloses(closes: number[]): { change: number; changeRate: number } {
  if (closes.length < 2) return { change: 0, changeRate: 0 };
  const cur = closes[closes.length - 1];
  const prev = closes[closes.length - 2];
  const change = cur - prev;
  return { change, changeRate: prev ? (change / prev) * 100 : 0 };
}

// BUY/HOLD/SELL(영문) 또는 한글 원문 → 한글 투자의견 라벨
export function opinionKo(raw: string | null | undefined): string {
  const s = String(raw ?? "").toUpperCase();
  if (s.includes("BUY") || s.includes("매수") || s.includes("STRONG")) return "매수";
  if (s.includes("SELL") || s.includes("매도") || s.includes("REDUCE")) return "매도";
  if (s.includes("HOLD") || s.includes("중립") || s.includes("NEUTRAL")) return "중립";
  return raw || "중립";
}
