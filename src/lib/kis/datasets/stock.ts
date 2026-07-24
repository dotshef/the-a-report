import { db } from "@/lib/db/server";
import { kisGet } from "../client";
import { dedupeByKey, num, toDate, toTimestamp, type StockDataset } from "./shared";

// PRD 축소: 종목당 quote(52주+산업) / daily(3개월 일봉) / news(뉴스) 3콜.

function yyyymmdd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}
function recentRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
  return { from: yyyymmdd(from), to: yyyymmdd(to) };
}

// ── quote: 현재가 → fundamental(52주) + stock.industry ──────────────────────
const quote: StockDataset = {
  key: "quote",
  async run(code) {
    const res = await kisGet<Record<string, string>>(
      "/uapi/domestic-stock/v1/quotations/inquire-price",
      { FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: code },
      "FHKST01010100",
    );
    const o = res.output;
    if (!o) return "unavailable";

    const { error: fErr } = await db()
      .from("fundamental")
      .upsert(
        {
          code,
          week52_high: num(o.w52_hgpr),
          week52_low: num(o.w52_lwpr),
          as_of: new Date().toISOString(),
        },
        { onConflict: "code" },
      );
    if (fErr) throw new Error(`fundamental upsert: ${fErr.message}`);

    // 같은 콜로 industry 편승 갱신
    if (o.bstp_kor_isnm) {
      await db().from("stock").update({ industry: o.bstp_kor_isnm }).eq("code", code);
    }
    return "ok";
  },
};

// ── daily: 일봉 OHLCV → price_daily (최근 ~95일 = 3개월 유지) ────────────────
const daily: StockDataset = {
  key: "daily",
  async run(code) {
    const { from, to } = recentRange(95);
    const res = await kisGet<unknown>(
      "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice",
      {
        FID_COND_MRKT_DIV_CODE: "J",
        FID_INPUT_ISCD: code,
        FID_INPUT_DATE_1: from,
        FID_INPUT_DATE_2: to,
        FID_PERIOD_DIV_CODE: "D",
        FID_ORG_ADJ_PRC: "0",
      },
      "FHKST03010100",
    );
    const list = (res.output2 ?? []) as Record<string, string>[];
    const rows = list
      .map((r) => ({
        code,
        date: toDate(r.stck_bsop_date),
        open: num(r.stck_oprc),
        high: num(r.stck_hgpr),
        low: num(r.stck_lwpr),
        close: num(r.stck_clpr),
        volume: num(r.acml_vol),
      }))
      .filter((r) => r.date);
    if (rows.length === 0) return "unavailable";
    const { error } = await db()
      .from("price_daily")
      .upsert(dedupeByKey(rows, (r) => r.date!), { onConflict: "code,date" });
    if (error) throw new Error(`price_daily upsert: ${error.message}`);
    return "ok";
  },
};

// ── news: 종목 뉴스 → news (중복은 unique 흡수) ──────────────────────────────
const news: StockDataset = {
  key: "news",
  async run(code) {
    const res = await kisGet<unknown>(
      "/uapi/domestic-stock/v1/quotations/news-title",
      {
        FID_NEWS_OFER_ENTP_CODE: "",
        FID_COND_MRKT_CLS_CODE: "",
        FID_INPUT_ISCD: code,
        FID_TITL_CNTT: "",
        FID_INPUT_DATE_1: "",
        FID_INPUT_HOUR_1: "",
        FID_RANK_SORT_CLS_CODE: "",
        FID_INPUT_SRNO: "",
      },
      "FHKST01011800",
    );
    const list = (res.output ?? []) as Record<string, string>[];
    const rows = list
      .map((r) => ({
        code,
        title: r.hts_pbnt_titl_cntt ?? "",
        source: r.dorg || null,
        published_at: toTimestamp(r.data_dt, r.data_tm),
      }))
      .filter((r) => r.title);
    if (rows.length === 0) return "ok";
    const { error } = await db()
      .from("news")
      .upsert(rows, { onConflict: "code,published_at,title", ignoreDuplicates: true });
    if (error) throw new Error(`news upsert: ${error.message}`);
    return "ok";
  },
};

export const STOCK_DATASETS: StockDataset[] = [quote, daily, news];
