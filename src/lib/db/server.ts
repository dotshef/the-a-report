import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 서버 전용 Supabase 클라이언트(서비스롤). 요청 경로·cron 모두 이 커넥션으로만 DB 접근.
// 자격증명은 NEXT_PUBLIC_ 금지 — 클라이언트 번들에 노출되면 안 됨.

let client: SupabaseClient | null = null;

// 로컬/미설정 환경에서 읽기 경로가 throw 없이 빈 상태로 degrade하도록 가드.
export const dbConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export function db(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.");
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
