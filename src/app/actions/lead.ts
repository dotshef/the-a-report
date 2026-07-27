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

export interface LeadState {
  ok: boolean;
  message: string;
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

  const field = (key: string) => String(formData.get(key) ?? "").trim() || undefined;

  // 저장(report_request)과 알림 메일이 동일한 유입/광고 트래킹 값을 쓰도록 한 번만 조립한다.
  const lead = {
    name,
    phone,
    interest,
    trafficSource: field("traffic_source"),
    adKeyword: field("ad_keyword"),
    adCampaignId: field("ad_campaign_id"),
    adCampaignLabel: field("ad_campaign_label"),
    landingUrl: field("landing_url"),
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

  return {
    ok: true,
    message: "신청이 완료되었어요. 오늘 저녁 리포트를 보내드릴게요!",
  };
}
