import { NextResponse } from "next/server";
import { acquireLock, releaseLock } from "@/lib/ingest/lock";
import { runBatch } from "@/lib/ingest/pump";

// 단일 Cron 펌프 엔드포인트. Vercel Cron이 매일 밤 22:00~23:55 KST
// (13:00~14:55 UTC) 2시간 창에서 5분 간격 호출.
// 장 마감(15:30 KST) 이후에 돌려야 KIS 일봉의 당일 봉이 '확정 종가'로 들어온다.
// 장중에 수집하면 미완성 봉의 stck_clpr = 그 시점 현재가라서 종가·등락률이 어긋난다.
// 동시 워커로 KIS 12req/s 포화 → 1회당 150종목 ~40s.
// 2,700종목 한 바퀴 ~19회(=약 1.5h). 다 돌면 12h 신선도로 남은 호출은 자동 no-op.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 800; // Pro

const LOCK_NAME = "ingest";
const LOCK_TTL_MS = 120_000; // 종목마다 heartbeat 연장

export async function GET(req: Request) {
  // 엔드포인트 보호: Authorization: Bearer ${CRON_SECRET}
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const owner = crypto.randomUUID();
  const acquired = await acquireLock(LOCK_NAME, owner, LOCK_TTL_MS);
  if (!acquired) {
    console.log("[ingest] skipped: 락 보유 중인 다른 실행 있음");
    return NextResponse.json({ skipped: "locked" });
  }

  try {
    const result = await runBatch({ lockName: LOCK_NAME, owner, lockTtlMs: LOCK_TTL_MS });
    if (result.selected === 0) console.log("[ingest] no-op: 오늘 수집할 종목 없음(전량 신선)");
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  } finally {
    await releaseLock(LOCK_NAME, owner);
  }
}
