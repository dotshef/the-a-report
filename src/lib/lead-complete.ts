import "server-only";
import { cookies, headers } from "next/headers";

// 신청 완료 페이지(/request/complete) 접근 게이트.
// 광고 매체 전환은 "완료 URL 도달"로 집계되므로, 직접 URL 진입·크롤러·새로고침이
// 허위 전환을 만들지 않도록 정상 접수 건에만 단기 쿠키를 발급해 통과시킨다.
// 통과권 검사와 1회용 소모는 proxy.ts가 담당한다.

export const COMPLETE_PATH = "/request/complete";
export const LEAD_DONE_COOKIE = "lead_done";

// proxy가 소모한 통과권 값을 이번 렌더로 전달하는 내부 헤더.
// (proxy의 쿠키 삭제는 같은 요청의 렌더에도 반영되어 쿠키를 다시 읽을 수 없다.)
export const LEAD_DONE_HEADER = "x-lead-done";

// 접수 직후 리다이렉트 도달까지면 충분한 시간. middleware 삭제가 실패하더라도
// 노출 창을 좁게 유지하기 위한 2차 방어선이다.
const MAX_AGE_SEC = 120;

export const LEAD_DONE_MESSAGE =
  "신청이 완료되었습니다.\n담당자가 순차적으로 연락드릴 예정입니다.";

export interface LeadCompletePayload {
  // 화면 표시용 관심 종목(예: "삼성전자(005930)"). 개인정보는 담지 않는다.
  interest?: string;
}

// 쿠키 값은 ASCII만 허용되므로 한글 종목명을 base64url로 인코딩해 싣는다.
function encode(payload: LeadCompletePayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decode(raw: string): LeadCompletePayload | null {
  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8"),
    );
    if (!parsed || typeof parsed !== "object") return null;
    const interest = (parsed as { interest?: unknown }).interest;
    return { interest: typeof interest === "string" ? interest : undefined };
  } catch {
    return null;
  }
}

/** 접수 성공 시 호출 — 완료 페이지 1회 통과권을 발급한다. */
export async function setLeadCompleteCookie(
  payload: LeadCompletePayload,
): Promise<void> {
  const store = await cookies();
  store.set(LEAD_DONE_COOKIE, encode(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COMPLETE_PATH,
    maxAge: MAX_AGE_SEC,
  });
}

/**
 * 완료 페이지에서 호출 — 통과권이 없으면 null.
 * 정상 경로에서는 proxy가 넘긴 헤더로 들어오고, proxy가 동작하지 않는 환경을 위해
 * 쿠키도 함께 확인한다(둘 다 서버가 발급한 값이라 위조 경로가 되지 않는다).
 */
export async function readLeadCompletePass(): Promise<LeadCompletePayload | null> {
  const raw =
    (await headers()).get(LEAD_DONE_HEADER) ??
    (await cookies()).get(LEAD_DONE_COOKIE)?.value;
  return raw ? decode(raw) : null;
}
