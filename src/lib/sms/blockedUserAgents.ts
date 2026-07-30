// ── 임시 응급조치: SMS 펌핑 공격 UA 지문 차단 ──
// 배경/근거는 docs/sms-pumping-ua-block-guide.md 참조.
// 공격자는 차단을 인지하면 UA를 로테이션한다. 한 번 넣고 끝나는 설정이 아니라
// 차단 로그(ua-blocked)의 UA 원문을 주기적으로 확인하며 갱신해야 하는 운영 대상이다.

// 완전일치 전용. Chrome 계열은 반드시 여기에만 넣는다.
// (Edge·웨일·삼성 브라우저·인앱 웹뷰가 모두 `Chrome/`을 포함하므로 부분일치는 정상 사용자를 대량 차단한다)
const BLOCKED_UA_EXACT = new Set<string>([
  // 최초 확인된 펌핑 공격 UA 지문. 위험도 낮음
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
  // 펌핑 우회 대응으로 추가(2026-07-23).
  // ⚠️ stock 안드로이드 크롬의 매우 흔한 UA와 완전 동일 → 실제 모바일 고객도 차단된다.
  //    인증 성공률이 급감하면 이 한 줄을 가장 먼저 제거할 것.
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36",
  // 웨일 모바일 UA를 위장한 펌핑 공격(2026-07-24). 버전이 특정되어 위험도 중간
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Whale/3.9.14.9 Mobile Safari/537.36",
]);

// 계열 전체를 부분일치로 차단. 완전일치로는 버전만 바꿔 즉시 우회되는 경우에만 사용한다.
// Firefox: 공격자가 Chrome 차단 인지 후 전환, 150/152/153을 섞어 로테이션 중(2026-07-30 추가).
const BLOCKED_UA_INCLUDES = ["Firefox/"];

export function isBlockedUserAgent(userAgent: string): boolean {
  return (
    BLOCKED_UA_EXACT.has(userAgent) ||
    BLOCKED_UA_INCLUDES.some((fingerprint) => userAgent.includes(fingerprint))
  );
}
