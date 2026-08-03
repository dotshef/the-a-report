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

// 중복 접수 판정 기준(개월). 이 기간 내 동일 이름+연락처 접수 이력이 있으면 중복으로 본다.
const DUPLICATE_WINDOW_MONTHS = 2;

// KST(UTC+9) 벽시계 문자열 — requested_at(tz 없음, DB 기본값이 KST 벽시계)과 비교하려면
// 이 형식이어야 한다. lib/sms/verificationStore.ts의 동일 헬퍼와 같은 이유.
function toKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 19).replace("T", " ");
}

/**
 * 최근 DUPLICATE_WINDOW_MONTHS개월 내 동일 이름+연락처(완전일치) 접수 이력이 있는지 확인.
 * IP/디바이스/세션/쿠키는 쓰지 않는다 — 순수 DB 조회. DB에는 unique 제약을 두지 않으므로
 * 호출자가 매 요청마다 이 함수로 애플리케이션 레벨에서 판단해야 한다.
 * 조회 자체가 실패하면(DB 장애 등) throw한다 — 호출자가 "중복 아님"과 구분해 처리할 것.
 */
export async function hasRecentDuplicateReportRequest(
  name: string,
  phone: string,
): Promise<boolean> {
  if (!dbConfigured) return false;

  const since = new Date();
  since.setMonth(since.getMonth() - DUPLICATE_WINDOW_MONTHS);

  const { data, error } = await db()
    .from("report_request")
    .select("id")
    .eq("name", name)
    .eq("phone", phone)
    .gte("requested_at", toKstTimestamp(since))
    .limit(1);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
