import { db } from "@/lib/db/server";

// 리스 락(cron 겹침 방지, 크래시 내성). 만료시각 기반 소유권 → 크래시해도 자동 해제.

export async function acquireLock(name: string, owner: string, ttlMs: number): Promise<boolean> {
  const now = Date.now();
  await db().from("cron_lock").delete().eq("name", name).lt("expires_at", new Date(now).toISOString());
  const { error } = await db()
    .from("cron_lock")
    .insert({ name, owner, expires_at: new Date(now + ttlMs).toISOString() });
  return !error;
}

export async function renewLock(name: string, owner: string, ttlMs: number): Promise<void> {
  await db()
    .from("cron_lock")
    .update({ expires_at: new Date(Date.now() + ttlMs).toISOString() })
    .eq("name", name)
    .eq("owner", owner);
}

export async function releaseLock(name: string, owner: string): Promise<void> {
  await db().from("cron_lock").delete().eq("name", name).eq("owner", owner);
}
