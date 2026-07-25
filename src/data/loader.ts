import { db, dbConfigured } from "@/lib/db/server";
import { generateTitles } from "@/data/report-titles";
import { changeFromCloses, opinionKo } from "@/data/derive";
import type { Stock } from "@/data/stock";
import type { ReportData, ReportSection, StockQuote, TrendingStock } from "@/lib/types";

// 한 줄 결론 / 분석 결과는 마스킹되므로 미리보기에서는 자리표시 텍스트로 채운다.
const MASKED_CONCLUSION =
  "지금 구간은 분할 매수로 접근할 만한 자리로 판단됩니다. 다만 단기 변동성은 유의가 필요합니다.";
const MASKED_ANALYSIS =
  "최근 실적 흐름과 업황 지표, 수급 데이터를 종합하면 밸류에이션 부담은 제한적입니다. 향후 촉매는 다음 분기 실적과 정책 모멘텀입니다.";

const n = (v: unknown): number => {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};

// ── 종목 검색: stock(ST) 이름/코드 매칭. 요청 경로는 DB만 읽음(미설정 시 빈 배열). ──
export async function searchStocks(query: string, limit = 8): Promise<Stock[]> {
  if (!dbConfigured) return [];
  const q = query.trim().replace(/[,%_()]/g, "");
  if (!q) return [];
  const { data, error } = await db()
    .from("stock")
    .select("code, name, market, industry")
    .eq("group_code", "ST")
    .or(`name.ilike.%${q}%,code.ilike.${q}%`)
    .order("name")
    .limit(limit);
  if (error) return [];
  return (data ?? []).map((r) => ({
    code: r.code as string,
    name: r.name as string,
    market: r.market as string,
    industry: (r.industry as string) ?? undefined,
  }));
}

// ── 리포트 미리보기: price_daily(3개월)·fundamental(52주)·news·stock 조인. ──
export async function getReport(code: string): Promise<ReportData | null> {
  if (!dbConfigured) return null;
  const supabase = db();

  const [stockR, fundR, priceR, newsR] = await Promise.all([
    supabase.from("stock").select("code, name, market, industry").eq("code", code).maybeSingle(),
    supabase.from("fundamental").select("week52_high, week52_low").eq("code", code).maybeSingle(),
    supabase
      .from("price_daily")
      .select("date, high, low, close")
      .eq("code", code)
      .order("date", { ascending: false })
      .limit(70),
    supabase
      .from("news")
      .select("title, source, published_at")
      .eq("code", code)
      .order("published_at", { ascending: false })
      .limit(5),
  ]);

  const stockRow = stockR.data;
  if (!stockRow) return null;

  const stock: Stock = {
    code: stockRow.code as string,
    name: stockRow.name as string,
    market: stockRow.market as string,
    industry: (stockRow.industry as string) ?? undefined,
  };

  const priceAsc = (priceR.data ?? []).slice().reverse(); // 시간순
  const closes = priceAsc.map((r) => n(r.close));
  const latest = priceAsc[priceAsc.length - 1];
  const current = latest ? n(latest.close) : 0;
  const { change, changeRate } = changeFromCloses(closes);

  const fund = fundR.data;
  const quote: StockQuote = {
    code,
    price: current,
    change,
    changeRate: Number(changeRate.toFixed(2)),
    high: latest ? n(latest.high) : current,
    low: latest ? n(latest.low) : current,
    high52w: fund?.week52_high ? n(fund.week52_high) : closes.length ? Math.max(...closes) : current,
    low52w: fund?.week52_low ? n(fund.week52_low) : closes.length ? Math.min(...closes) : current,
    history: priceAsc.slice(-63).map((r) => ({ date: String(r.date), close: n(r.close) })),
    // 시세 기준 시각 = 현재가로 쓰는 price_daily 최신 행의 거래일(종가 기준).
    updatedAt: latest ? String(latest.date) : "",
  };

  const titles = generateTitles({ name: stock.name, industry: stock.industry });
  const news = (newsR.data ?? []).map((r) => ({
    title: r.title as string,
    source: (r.source as string) || "한국투자증권",
    date: r.published_at ? String(r.published_at).slice(0, 10) : "",
    url: "#",
  }));

  const sections: ReportSection[] = titles.map((t, i) => ({
    title: t.title,
    category: t.category,
    conclusion: MASKED_CONCLUSION,
    analysis: MASKED_ANALYSIS,
    news: i === 0 ? news.slice(0, 3) : news.slice(3, 5),
  }));

  return { stock, quote, sections };
}

// ── 지금 많이 찾는 종목: top_view 상위 10 중 투자의견 보유 종목만 최대 N. ──
export async function getTrending(limit = 8): Promise<TrendingStock[]> {
  if (!dbConfigured) return [];
  const supabase = db();

  const { data: tv } = await supabase
    .from("top_view")
    .select("rank, code")
    .order("rank", { ascending: true })
    .limit(10);
  const codes = (tv ?? []).map((r) => r.code as string);
  if (codes.length === 0) return [];

  // 투자의견 보유 여부 + 최신 의견
  const { data: ops } = await supabase
    .from("invest_opinion")
    .select("code, opinion, opinion_date")
    .in("code", codes)
    .order("opinion_date", { ascending: false });
  const opinionByCode = new Map<string, string>();
  for (const o of ops ?? []) {
    if (!opinionByCode.has(o.code as string)) {
      opinionByCode.set(o.code as string, opinionKo(o.opinion as string));
    }
  }

  const picks = codes.filter((c) => opinionByCode.has(c)).slice(0, limit);
  if (picks.length === 0) return [];

  const [{ data: stocks }, priceRows] = await Promise.all([
    supabase.from("stock").select("code, name, market, industry").in("code", picks),
    Promise.all(
      picks.map((code) =>
        supabase
          .from("price_daily")
          .select("close, date")
          .eq("code", code)
          .order("date", { ascending: false })
          .limit(1)
          .then((r) => ({ code, closes: (r.data ?? []).map((x) => n(x.close)) })),
      ),
    ),
  ]);

  const stockByCode = new Map(
    (stocks ?? []).map((s) => [
      s.code as string,
      {
        code: s.code as string,
        name: s.name as string,
        market: s.market as string,
        industry: (s.industry as string) ?? undefined,
      } as Stock,
    ]),
  );
  const closesByCode = new Map(priceRows.map((p) => [p.code, p.closes])); // date desc → [0]=최신

  const out: TrendingStock[] = [];
  for (const code of picks) {
    const stock = stockByCode.get(code);
    if (!stock) continue;
    const closes = closesByCode.get(code) ?? [];
    const price = closes[0] ?? 0;
    out.push({
      stock,
      opinion: opinionByCode.get(code) ?? "중립",
      price,
    });
  }
  return out;
}
