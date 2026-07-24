export function won(n: number): string {
  return n.toLocaleString("ko-KR");
}

export function signed(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toLocaleString("ko-KR")}`;
}

export function pct(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}
