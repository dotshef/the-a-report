import { db, dbConfigured } from "@/lib/db/server";
import {
  generateTitles,
  type ReportCategory,
  type ReportTitle,
} from "@/data/report-titles";
import { changeFromCloses, opinionKo } from "@/data/derive";
import type { Stock } from "@/data/stock";
import type {
  ReportData,
  ReportSection,
  StockQuote,
  TickerData,
  TickerItem,
  TrendingStock,
} from "@/lib/types";

// 한 줄 결론 / 분석 결과는 마스킹되므로 미리보기에서는 자리표시 텍스트로 채운다.
const MASKED_CONCLUSION =
  "지금 구간은 분할 매수로 접근할 만한 자리로 판단됩니다. 다만 단기 변동성은 유의가 필요합니다.";
const MASKED_ANALYSIS =
  "최근 실적 흐름과 업황 지표, 수급 데이터를 종합하면 밸류에이션 부담은 제한적입니다. 향후 촉매는 다음 분기 실적과 정책 모멘텀입니다.";

const n = (v: unknown): number => {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};

const REPORT_CATEGORIES = new Set<ReportCategory>([
  "실적",
  "성장성",
  "밸류에이션",
  "수급·모멘텀",
  "산업·정책",
  "리스크",
]);

function isReportCategory(value: unknown): value is ReportCategory {
  return typeof value === "string" && REPORT_CATEGORIES.has(value as ReportCategory);
}

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

  const [stockR, fundR, priceR, newsR, reportTitleR] = await Promise.all([
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
    supabase
      .from("report_title")
      .select("slot, title, category")
      .eq("code", code)
      .order("slot", { ascending: true })
      .limit(2),
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

  const reportTitleRows = reportTitleR.error ? [] : (reportTitleR.data ?? []);
  const dbTitles: ReportTitle[] | null =
    reportTitleRows.length === 2 &&
    reportTitleRows.every(
      (row, slot) =>
        row.slot === slot &&
        typeof row.title === "string" &&
        row.title.trim().length > 0 &&
        isReportCategory(row.category),
    )
      ? reportTitleRows.map((row) => ({
          title: (row.title as string).trim(),
          category: row.category as ReportCategory,
        }))
      : null;
  const titles = dbTitles ?? generateTitles({ name: stock.name, industry: stock.industry });
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

// ── 상단 시세 티커: top_view 상위 N의 종목명 + 최신 종가 + 전일 대비 등락률. ──
// 리포트 미리보기(getReport)와 같은 소스(price_daily 최신 2개 종가)로 등락률을 계산한다.
// price_daily는 장 마감 후 수집(cron 22:00 KST)이므로 항상 '확정 종가' 기준이고,
// 장중에는 갱신되지 않는다 → asOf(기준 거래일)를 함께 돌려 화면에 표기한다.
export async function getTicker(limit = 12): Promise<TickerData> {
  if (!dbConfigured) return { items: [], asOf: "" };
  const supabase = db();

  const { data: tv } = await supabase
    .from("top_view")
    .select("rank, code")
    .order("rank", { ascending: true })
    .limit(limit);
  const codes = (tv ?? []).map((r) => r.code as string);
  if (codes.length === 0) return { items: [], asOf: "" };

  const [{ data: stocks }, priceRows] = await Promise.all([
    supabase.from("stock").select("code, name").in("code", codes),
    Promise.all(
      codes.map((code) =>
        supabase
          .from("price_daily")
          .select("close, date")
          .eq("code", code)
          .order("date", { ascending: false })
          .limit(2)
          // date desc → 오름차순(과거→최신)으로 뒤집어 changeFromCloses에 맞춘다.
          .then((r) => ({ code, rows: (r.data ?? []).slice().reverse() })),
      ),
    ),
  ]);

  const nameByCode = new Map((stocks ?? []).map((s) => [s.code as string, s.name as string]));
  const rowsByCode = new Map(priceRows.map((p) => [p.code, p.rows]));

  const items: TickerItem[] = [];
  let asOf = "";
  for (const code of codes) {
    const name = nameByCode.get(code);
    const rows = rowsByCode.get(code) ?? [];
    const latest = rows[rows.length - 1];
    const price = latest ? n(latest.close) : 0;
    // 이름·종가가 없으면 티커에 노출하지 않는다.
    if (!name || price <= 0) continue;
    const { changeRate } = changeFromCloses(rows.map((x) => n(x.close)));
    items.push({ code, name, price, changeRate: Number(changeRate.toFixed(2)) });
    // 종목별로 최신 거래일이 다를 수 있어(수집 실패 등) 가장 앞선 날짜를 기준일로 쓴다.
    const date = String(latest.date);
    if (date > asOf) asOf = date;
  }
  return { items, asOf };
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
