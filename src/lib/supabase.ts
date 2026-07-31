// 리드/인증 저장 헬퍼 — 서버 서비스롤(db())로만 접근.
// env 미설정 시 no-op(로그만)으로 degrade해 로컬에서 실행 가능.

import { db, dbConfigured } from "@/lib/db/server";

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
    // 광고 유입이 아닌 리드(traffic_source=unknown)는 landing_url을 남기지 않는다 —
    // 유입 URL은 광고 파라미터 원본 보존용이라 자연/직접 유입에는 의미가 없다.
    landing_url: input.landingUrl ?? null,
  });
  return { ok: !error };
}
// 휴대폰 인증 저장/검증은 lib/sms/verificationStore.ts에서 담당한다.
