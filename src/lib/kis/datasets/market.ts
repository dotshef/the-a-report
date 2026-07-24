import { db } from "@/lib/db/server";
import { kisGet } from "../client";
import { isCommonStock } from "@/data/stock";
import { dedupeByKey, num, toDate, type MarketDataset } from "./shared";

function yyyymmdd(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

// ── HTS 조회상위 (HHMCM000100C0) → 보통주 필터 후 원자 교체 ──────────────────
const topView: MarketDataset = {
  key: "top_view",
  async run() {
    const res = await kisGet<unknown>(
      "/uapi/domestic-stock/v1/ranking/hts-top-view",
      {},
      "HHMCM000100C0",
      { custtype: "P" },
    );
    const list = (res.output1 ?? res.output ?? []) as Record<string, string>[];
    const codes = list.map((r) => String(r.mksc_shrn_iscd ?? "").trim()).filter(Boolean);
    if (codes.length === 0) return "unavailable";

    // 보통주 판정은 서버 로직(isCommonStock)이 소유. stock에서 group_code만 읽어 앱에서 필터.
    const { data: candidates } = await db()
      .from("stock")
      .select("code, group_code")
      .in("code", codes);
    const commonSet = new Set(
      (candidates ?? [])
        .filter((s) => isCommonStock(s.code as string, s.group_code as string))
        .map((s) => s.code as string),
    );

    const now = new Date().toISOString();
    const rows = codes
      .filter((c) => commonSet.has(c))
      .map((code, i) => ({ rank: i + 1, code, fetched_at: now }));
    if (rows.length === 0) return "ok";

    // 원자 교체: 전체 삭제 후 재삽입(단일 워커 cron)
    const { error: delErr } = await db().from("top_view").delete().gte("rank", 0);
    if (delErr) throw new Error(`top_view delete: ${delErr.message}`);
    const { error: insErr } = await db().from("top_view").insert(rows);
    if (insErr) throw new Error(`top_view insert: ${insErr.message}`);
    return "ok";
  },
};

// ── top_opinions: top_view 후보 코드에 대해서만 투자의견 수집 → invest_opinion ─
// (전 종목이 아니라 조회상위 종목만 → 야간 추가 콜 미미. 트렌딩 "투자의견 보유" 필터용)
const topOpinions: MarketDataset = {
  key: "top_opinions",
  async run() {
    const { data: tv } = await db().from("top_view").select("code").order("rank");
    const codes = (tv ?? []).map((r) => r.code as string);
    if (codes.length === 0) return "unavailable";

    const to = yyyymmdd(new Date());
    const from = yyyymmdd(new Date(Date.now() - 400 * 24 * 60 * 60 * 1000));

    for (const code of codes) {
      const res = await kisGet<unknown>(
        "/uapi/domestic-stock/v1/quotations/invest-opinion",
        {
          FID_COND_MRKT_DIV_CODE: "J",
          FID_COND_SCR_DIV_CODE: "16633",
          FID_INPUT_ISCD: code,
          FID_INPUT_DATE_1: from,
          FID_INPUT_DATE_2: to,
        },
        "FHKST663300C0",
      );
      const rows = ((res.output ?? []) as Record<string, string>[])
        .map((r) => ({
          code,
          opinion_date: toDate(r.stck_bsop_date),
          firm: String(r.mbcr_name ?? "").trim(),
          opinion: r.invt_opnn || null,
          target_price: num(r.hts_goal_prc),
          gap_rate: num(r.dprt),
        }))
        .filter((r) => r.opinion_date && r.firm);
      if (rows.length === 0) continue;
      await db()
        .from("invest_opinion")
        .upsert(dedupeByKey(rows, (r) => `${r.opinion_date}:${r.firm}`), {
          onConflict: "code,opinion_date,firm",
        });
    }
    return "ok";
  },
};

export const MARKET_DATASETS: MarketDataset[] = [topView, topOpinions];
