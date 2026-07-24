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

  // 리포트 신청 기록 저장 (report_request) — 유입/광고 트래킹 포함
  const saved = await insertReportRequest({
    name,
    phone,
    interest,
    trafficSource: String(formData.get("traffic_source") ?? "").trim() || undefined,
    adKeyword: String(formData.get("ad_keyword") ?? "").trim() || undefined,
    adCampaignId: String(formData.get("ad_campaign_id") ?? "").trim() || undefined,
    adCampaignLabel: String(formData.get("ad_campaign_label") ?? "").trim() || undefined,
    landingUrl: String(formData.get("landing_url") ?? "").trim() || undefined,
  });
  if (!saved.ok) return { ok: false, message: "잠시 후 다시 시도해 주세요" };

  // 리드 알림 메일 (Resend)
  await sendLeadEmail({ name, phone, interestedName: interest });

  return {
    ok: true,
    message: "신청이 완료되었어요. 오늘 저녁 리포트를 보내드릴게요!",
  };
}
