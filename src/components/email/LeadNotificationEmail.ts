// 리드 알림 메일 템플릿 — 디자인 시스템(globals.css) 토큰을 이메일용으로 옮긴 것.
// 메일 클라이언트는 CSS 변수·외부 스타일시트·웹폰트·flex/grid를 지원하지 않으므로
// 토큰 값을 hex로 고정하고 스타일을 전부 인라인으로, 레이아웃은 Outlook 호환 table로 짠다.
// (JSX가 아닌 문자열 템플릿인 이유: react-dom/server는 Next 서버 컴포넌트 그래프에서 import 불가.)

import { formatPhone } from "@/lib/phone";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// globals.css :root 토큰 미러 — 값이 바뀌면 여기도 함께 갱신한다.
const T = {
  gold: "#D4AF37",
  black: "#1E1E1E",
  white: "#FFFFFF",
  gray: "#A3A3A3",
  coolGray: "#888888",
  fill: "#F7F7F7",
  border: "#E6E6E6",
  link: "#007AFF",
  radiusDefault: "12px",
  radiusComfort: "16px",
  font: `-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif`,
} as const;

export interface LeadNotificationEmailProps {
  name: string;
  phone: string;
  interestedName?: string;
  // report_request 트래킹 컬럼과 1:1 — 메일에도 전부 노출한다.
  trafficSource?: string;
  adKeyword?: string;
  adCampaignId?: string;
  adCampaignLabel?: string;
  landingUrl?: string;
  submittedAt?: Date;
}

// 사용자 입력이 마크업으로 해석되지 않도록 항상 이스케이프해서 삽입한다.
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 신청 시각은 서버 TZ와 무관하게 한국 시간으로 표기.
function formatSeoulTime(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const EMPTY = `<span style="color:${T.gray};font-weight:400;">&mdash;</span>`;

// 라벨/값 한 줄. 값이 없으면 대시로, 마지막 행은 하단 구분선을 그리지 않는다.
function row(
  label: string,
  valueHtml: string | undefined,
  opts: { last?: boolean; wrap?: boolean } = {},
): string {
  const { last = false, wrap = false } = opts;
  const cell = `padding:${last ? "10px 0 0" : "10px 0"};border-bottom:${
    last ? "none" : `1px solid ${T.border}`
  };vertical-align:top;`;
  return `
    <tr>
      <td style="${cell}width:96px;font-size:13px;color:${T.coolGray};white-space:nowrap;">${esc(label)}</td>
      <td style="${cell}font-size:15px;font-weight:700;color:${T.black};text-align:right;${
        // 유입 URL처럼 긴 값은 셀 밖으로 넘치지 않게 강제 줄바꿈.
        wrap ? "word-break:break-all;font-size:12px;font-weight:400;line-height:1.5;" : ""
      }">${valueHtml || EMPTY}</td>
    </tr>`;
}

/** 리드 알림 메일 본문 HTML. */
export function renderLeadNotificationEmail({
  name,
  phone,
  interestedName,
  trafficSource,
  adKeyword,
  adCampaignId,
  adCampaignLabel,
  landingUrl,
  submittedAt = new Date(),
}: LeadNotificationEmailProps): string {
  const headline = `${SITE_NAME} 리포트 신청이 들어왔습니다`;
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${esc(headline)}</title>
</head>
<body style="margin:0;padding:0;background-color:${T.fill};">
<!-- 받은편지함 미리보기 문구 — 본문에는 보이지 않게 숨긴다. -->
<div style="display:none;overflow:hidden;max-height:0;max-width:0;opacity:0;">${esc(headline)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:${T.fill};font-family:${T.font};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:480px;background-color:${T.white};border:1px solid ${T.border};border-radius:${T.radiusDefault};overflow:hidden;">
        <!-- 브랜드 골드 액센트 바 -->
        <tr><td style="height:4px;line-height:4px;font-size:0;background-color:${T.gold};">&nbsp;</td></tr>
        <tr>
          <td style="padding:28px 24px 24px;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.04em;color:${T.gold};">${esc(SITE_NAME)}</p>
            <h1 style="margin:0 0 20px;font-size:20px;line-height:1.4;font-weight:700;color:${T.black};">${esc(headline)}</h1>

            <!-- 신청 내역 — fill 카드(16px radius) -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:${T.fill};border-radius:${T.radiusComfort};">
              <tr>
                <td style="padding:6px 20px 14px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    ${row("이름", esc(name))}
                    ${row("연락처", `<a href="tel:${esc(phone)}" style="color:${T.link};text-decoration:none;">${esc(formatPhone(phone))}</a>`)}
                    ${row("관심 종목", interestedName && esc(interestedName))}
                    ${row("유입 광고 매체", trafficSource && esc(trafficSource))}
                    ${row("광고 키워드", adKeyword && esc(adKeyword))}
                    ${row("캠페인 ID", adCampaignId && esc(adCampaignId))}
                    ${row("캠페인 라벨", adCampaignLabel && esc(adCampaignLabel))}
                    ${row(
                      "유입 URL",
                      landingUrl &&
                        `<a href="${esc(landingUrl)}" style="color:${T.link};text-decoration:none;">${esc(landingUrl)}</a>`,
                      { wrap: true },
                    )}
                    ${row("신청 시각", esc(formatSeoulTime(submittedAt)), { last: true })}
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${T.coolGray};">오늘 저녁 리포트 발송 대상에 포함해 주세요.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 24px;border-top:1px solid ${T.border};font-size:12px;color:${T.gray};">
            <a href="${esc(SITE_URL)}" style="color:${T.gray};text-decoration:none;">${esc(host)}</a> &middot; 리드 신청 알림 (자동 발송)
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** 메일 제목 — [리포트 신청] 이름 / 종목 (종목 미선택 시 이름까지만). */
export function leadNotificationSubject(params: {
  name: string;
  interestedName?: string;
}): string {
  return params.interestedName
    ? `[리포트 신청] ${params.name} / ${params.interestedName}`
    : `[리포트 신청] ${params.name}`;
}
