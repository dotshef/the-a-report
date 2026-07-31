import { NextResponse, type NextRequest } from "next/server";
import { COMPLETE_PATH, LEAD_DONE_COOKIE } from "@/lib/lead-complete";

// 완료 페이지 통과권(lead_done)을 1회용으로 만든다.
// 페이지는 요청 쿠키를 그대로 읽어 정상 렌더되고, 응답에서만 쿠키가 삭제되므로
// 새로고침·뒤로가기로 같은 신청 건의 전환이 중복 집계되지 않는다.
// (서버 컴포넌트에서는 쿠키 삭제가 불가해 여기서 처리한다.)
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy
export default function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (request.cookies.has(LEAD_DONE_COOKIE)) {
    response.cookies.delete({ name: LEAD_DONE_COOKIE, path: COMPLETE_PATH });
  }
  return response;
}

export const config = {
  matcher: ["/request/complete"],
};
