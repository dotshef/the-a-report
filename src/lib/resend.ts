// Resend — lead notification email. https://resend.com/docs/send-with-nextjs
// Degrades to a no-op (log only) when RESEND_API_KEY is absent.

const API_KEY = process.env.RESEND_API_KEY;
const FROM = "리포트 신청 <onboarding@resend.dev>";
const NOTIFY = process.env.EMAIL_TO;

export const resendConfigured = Boolean(API_KEY && NOTIFY);

/** 신규 리드 알림 메일 발송. */
export async function sendLeadEmail(params: {
  name: string;
  phone: string;
  interestedName?: string;
}): Promise<{ ok: boolean }> {
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
      subject: `[신규 리드] ${params.name} 님`,
      html: `
        <div style="font-family:Pretendard,system-ui,sans-serif;color:#1E1E1E">
          <h2 style="margin:0 0 12px">새로운 리포트 신청이 들어왔어요</h2>
          <p style="margin:4px 0">이름: <b>${params.name}</b></p>
          <p style="margin:4px 0">연락처: <b>${params.phone}</b></p>
          ${params.interestedName ? `<p style="margin:4px 0">관심 종목: <b>${params.interestedName}</b></p>` : ""}
        </div>`,
    }),
    cache: "no-store",
  });
  return { ok: res.ok };
}
