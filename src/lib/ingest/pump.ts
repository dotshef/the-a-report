import { db } from "@/lib/db/server";
import { STOCK_DATASETS } from "@/lib/kis/datasets/stock";
import { MARKET_DATASETS } from "@/lib/kis/datasets/market";
import { MARKET_CODE, type DatasetResult } from "@/lib/kis/datasets/shared";
import { renewLock } from "./lock";
import { ALL_MARKER, isMarketDatasetFresh, selectStaleStocks } from "./cursor";

// 단일 Cron 펌프. 청크(150종목)를 동시 수집 → 멱등 upsert → ingest_state 갱신.
export const CHUNK_SIZE = 150;
const TIME_BUDGET_MS = 700_000; // maxDuration=800s 대비 여유
// 공유 레이트리미터(KIS 12req/s)를 실제로 포화시키기 위한 동시 워커 수.
// 호출당 왕복 ~0.8s이라 요청 1개씩 순차로는 ~0.8req/s밖에 안 나온다.
// 워커를 겹쳐 두면 리미터가 84ms 간격으로 흘려보내 ~12req/s를 채운다.
const CONCURRENCY = 16;

interface BatchArgs {
  lockName: string;
  owner: string;
  lockTtlMs: number;
}

type Stats = Record<string, { ok: number; unavailable: number; error: number }>;
function bump(stats: Stats, key: string, status: DatasetResult | "error"): void {
  const s = (stats[key] ??= { ok: 0, unavailable: 0, error: 0 });
  s[status]++;
}

async function recordState(
  code: string,
  dataset: string,
  status: DatasetResult | "error",
  error?: string,
): Promise<void> {
  await db()
    .from("ingest_state")
    .upsert(
      { code, dataset, status, fetched_at: new Date().toISOString(), error: error ?? null },
      { onConflict: "code,dataset" },
    );
}

async function processStock(code: string, stats: Stats): Promise<void> {
  // 이전에 'unavailable'로 찍힌 데이터셋은 재호출 억제.
  const { data: states } = await db()
    .from("ingest_state")
    .select("dataset,status")
    .eq("code", code);
  const unavailable = new Set(
    (states ?? []).filter((s) => s.status === "unavailable").map((s) => s.dataset),
  );

  for (const ds of STOCK_DATASETS) {
    if (unavailable.has(ds.key)) continue;
    try {
      const result = await ds.run(code);
      await recordState(code, ds.key, result);
      bump(stats, ds.key, result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await recordState(code, ds.key, "error", msg);
      bump(stats, ds.key, "error");
      console.error(`[ingest] ${code}/${ds.key} error: ${msg}`);
    }
  }
  await recordState(code, ALL_MARKER, "ok");
}

export async function runBatch({ lockName, owner, lockTtlMs }: BatchArgs) {
  const start = Date.now();
  const stats: Stats = {};

  // 시장 데이터셋은 데이터셋별로 야간 1회만(성공 기준). 실패/미수집이면 다음 실행이 재시도.
  for (const ds of MARKET_DATASETS) {
    if (await isMarketDatasetFresh(ds.key)) continue;
    try {
      const result = await ds.run();
      await recordState(MARKET_CODE, ds.key, result);
      bump(stats, ds.key, result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await recordState(MARKET_CODE, ds.key, "error", msg);
      bump(stats, ds.key, "error");
      console.error(`[ingest] _MARKET_/${ds.key} error: ${msg}`);
    }
    await renewLock(lockName, owner, lockTtlMs);
  }

  const codes = await selectStaleStocks(CHUNK_SIZE);
  let processed = 0;
  let cursor = 0;
  // 동시 워커 풀: 각 워커가 커서로 다음 종목을 집어 처리 → 항상 CONCURRENCY개가 in-flight.
  async function worker(): Promise<void> {
    while (Date.now() - start <= TIME_BUDGET_MS) {
      const i = cursor++;
      if (i >= codes.length) return;
      await processStock(codes[i], stats);
      processed++;
      await renewLock(lockName, owner, lockTtlMs);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, codes.length) }, worker));

  const elapsedMs = Date.now() - start;
  const summary = { processed, selected: codes.length, elapsedMs, stats };
  const line = Object.entries(stats)
    .map(
      ([k, v]) =>
        `${k}:${v.ok}ok${v.unavailable ? `/${v.unavailable}una` : ""}${v.error ? `/${v.error}err` : ""}`,
    )
    .join(" ");
  console.log(
    `[ingest] processed=${processed}/${codes.length} ${Math.round(elapsedMs / 1000)}s | ${line}`,
  );

  return summary;
}
