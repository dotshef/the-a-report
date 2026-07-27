// 리드/인증 저장 헬퍼 — 서버 서비스롤(db())로만 접근.
// env 미설정 시 no-op(로그만)으로 degrade해 로컬에서 실행 가능.

import { db, dbConfigured } from "@/lib/db/server";
import { SITE_URL } from "@/lib/site";

// ---------- report_request (리드) ----------
export interface ReportRequestInput {
  name: string;
  phone: string;
  interest?: string;
  trafficSource?: string;
  adKeyword?: string;
  adCampaignId?: string;
  adCampaignLabel?: string;
  landingUrl?: string;
}

export async function insertReportRequest(
  input: ReportRequestInput,
): Promise<{ ok: boolean }> {
  if (!dbConfigured) {
    console.info("[supabase] not configured — skipping report_request insert", input.phone);
    return { ok: true };
  }
  const { error } = await db().from("report_request").insert({
    name: input.name,
    phone: input.phone,
    interest: input.interest ?? null,
    traffic_source: input.trafficSource || "unknown",
    ad_keyword: input.adKeyword ?? null,
    ad_campaign_id: input.adCampaignId ?? null,
    ad_campaign_label: input.adCampaignLabel ?? null,
    // JS 비활성 등으로 클라이언트 값이 비면 정식 도메인 루트로 기록한다.
    landing_url: input.landingUrl ?? SITE_URL,
  });
  return { ok: !error };
}
// 휴대폰 인증 저장/검증은 lib/sms/verificationStore.ts에서 담당한다.
