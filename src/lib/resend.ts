// 리드 알림 메일 발송(Resend). RESEND_API_KEY가 없으면 로그만 남기고 넘어간다.
// 제목·본문 마크업은 components/email/LeadNotificationEmail.ts가 담당한다.

import {
  leadNotificationSubject,
  renderLeadNotificationEmail,
  type LeadNotificationEmailProps,
} from "@/components/email/LeadNotificationEmail";

const API_KEY = process.env.RESEND_API_KEY;
// 발신 도메인은 Resend에서 인증된 것이어야 한다(미인증 시 403).
const FROM = "에이주식 연구소 리포트 신청 <no-reply@plankor.kr>";
const NOTIFY = process.env.EMAIL_TO;

export const resendConfigured = Boolean(API_KEY && NOTIFY);

export async function sendLeadEmail(
  params: LeadNotificationEmailProps,
): Promise<{ ok: boolean }> {
  if (!resendConfigured) {
    console.info("[resend] not configured — skipping lead email", params.phone);
    return { ok: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY],
      subject: leadNotificationSubject(params),
      html: renderLeadNotificationEmail(params),
    }),
    cache: "no-store",
  });
  // 리드는 이미 DB에 저장된 뒤이므로 발송 실패로 접수를 되돌리지는 않되,
  // 원인(도메인 미인증·수신자 제한 등)을 반드시 서버 로그에 남긴다.
  if (!res.ok) {
    console.error(
      `[resend] lead email failed ${res.status}`,
      await res.text().catch(() => ""),
    );
  }
  return { ok: res.ok };
}
