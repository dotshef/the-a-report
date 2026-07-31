import { NextResponse, type NextRequest } from "next/server";
import {
  COMPLETE_PATH,
  LEAD_DONE_COOKIE,
  LEAD_DONE_HEADER,
} from "@/lib/lead-complete";

// 완료 페이지 통과권(lead_done) 검사 + 1회용 소모.
//
// 통과권 없이 들어온 요청(직접 URL 진입·크롤러·새로고침)은 광고 추적 스크립트가
// 실행되기 전에 루트로 돌려보내 허위 전환을 막는다.
//
// 쿠키 삭제는 응답에서 이뤄지지만 Next는 proxy의 쿠키 변경을 같은 요청의 렌더에도
// 반영한다 — 그래서 페이지가 쿠키를 다시 읽을 수 없다. 이번 렌더가 쓸 값은
// 요청 헤더로 넘긴다(항상 서버 값으로 덮어쓰므로 클라이언트가 위조할 수 없다).
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy
export default function proxy(request: NextRequest) {
  const pass = request.cookies.get(LEAD_DONE_COOKIE)?.value;
  if (!pass) return NextResponse.redirect(new URL("/", request.url));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LEAD_DONE_HEADER, pass);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.delete({ name: LEAD_DONE_COOKIE, path: COMPLETE_PATH });
  return response;
}

export const config = {
  matcher: ["/request/complete"],
};
