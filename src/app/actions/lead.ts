"use server";

// Server Action — 리포트 신청(리드) 수집.
// 휴대폰 인증은 /api/sms/send-code · /api/sms/verify-code (egress gateway)로 처리하고,
// 여기서는 인증 완료(isPhoneVerified) 여부를 서버에서 재확인한 뒤에만 접수한다.
// https://nextjs.org/docs/app/getting-started/updating-data

import { dbConfigured } from "@/lib/db/server";
import { insertReportRequest } from "@/lib/supabase";
import { isPhoneVerified } from "@/lib/sms/verificationStore";
import { sendLeadEmail } from "@/lib/resend";
import { normalizePhone } from "@/lib/phone";
import { isolateBySource, normalizeTrafficSource } from "@/lib/tracking";
import {
  COMPLETE_PATH,
  LEAD_DONE_MESSAGE,
  setLeadCompleteCookie,
} from "@/lib/lead-complete";

export interface LeadState {
  ok: boolean;
  message: string;
  // 접수 성공 시 이동할 완료 페이지 경로 (광고 전환 집계용 URL).
  redirectTo?: string;
}

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const interest = String(formData.get("interest") ?? "").trim() || undefined;

  if (name.length < 1) return { ok: false, message: "이름을 입력해 주세요" };
  if (!phone) return { ok: false, message: "휴대폰 번호 형식을 확인해 주세요" };

  // 인증 완료된 번호만 접수 (DB 미설정 로컬에서는 스킵)
  if (dbConfigured && !(await isPhoneVerified(phone))) {
    return { ok: false, message: "휴대폰 인증을 먼저 완료해 주세요" };
  }

  const field = (key: string) => String(formData.get(key) ?? "").trim();

  // 광고 유입 정보 서버 재정규화 — 폼 payload는 위조 가능하므로 클라이언트 판정을
  // 그대로 믿지 않는다. 매체를 화이트리스트로 좁힌 뒤, 매체와 모순되는 필드는 버린다.
  // (docs/광고-유입-정보-수집-전략.md)
  const attribution = isolateBySource(
    normalizeTrafficSource(field("traffic_source")),
    {
      ad_keyword: field("ad_keyword"),
      ad_campaign_id: field("ad_campaign_id"),
      ad_campaign_label: field("ad_campaign_label"),
      landing_url: field("landing_url"),
    },
  );

  // 저장(report_request)과 알림 메일이 동일한 유입/광고 트래킹 값을 쓰도록 한 번만 조립한다.
  const lead = {
    name,
    phone,
    interest,
    trafficSource: attribution.traffic_source,
    adKeyword: attribution.ad_keyword || undefined,
    adCampaignId: attribution.ad_campaign_id || undefined,
    adCampaignLabel: attribution.ad_campaign_label || undefined,
    landingUrl: attribution.landing_url || undefined,
  };

  const saved = await insertReportRequest(lead);
  if (!saved.ok) return { ok: false, message: "잠시 후 다시 시도해 주세요" };

  // 리드 알림 메일 (Resend) — 저장은 이미 끝났으므로 발송 실패가 접수를 막지 않는다.
  try {
    const mailed = await sendLeadEmail({ ...lead, interestedName: interest });
    if (!mailed.ok) console.warn("[lead] saved but email not sent", phone);
  } catch (e) {
    console.error("[lead] email threw", e);
  }

  // 완료 페이지 1회 통과권 — 직접 URL 진입으로 허위 전환이 잡히는 것을 막는다.
  await setLeadCompleteCookie({ interest });

  return { ok: true, message: LEAD_DONE_MESSAGE, redirectTo: COMPLETE_PATH };
}
