// 네이버 전환추적(wcslog) 연동 — docs/네이버_전환추적_스크립트_theareport.md 구현.
//
// 가이드는 MPA 기준(모든 페이지 </body> 직전에 스크립트 삽입)이지만 이 사이트는
// App Router라 문서가 한 번만 로드된다. 그래서 wcslog.js는 layout에서 1회만 싣고,
// PV는 라우트가 바뀔 때마다 다시 발화시켜 "모든 페이지 설치"와 같은 효과를 낸다.
//
// 호출 순서 규칙(가이드 2.5): wcs_do()(PV)가 먼저, wcs.trans()(전환)가 나중.
// 완료 페이지에서도 PV는 layout이 쏘므로 전환 코드는 PV 완료를 기다렸다 실행한다.

/** 네이버 공통키(AccountId). */
export const NAVER_ACCOUNT_ID = "s_22b921bb66ac";

export const WCSLOG_SRC = "https://wcs.naver.net/wcslog.js";

// 광고 전환추적용 cookie domain. www 유무와 무관하게 유입 정보가 공유되도록
// 서브도메인을 뺀 등록 도메인으로 설정한다.
const INFLOW_DOMAIN = "theareport.com";

// 전환 유형 — lead(신청완료)를 쓴다. 나머지는 매체 정의상 가능한 값(참고용).
export type NaverConversionType =
  | "lead"
  | "inquiry"
  | "add_contact_method"
  | "sign_up";

interface Wcs {
  inflow: (domain?: string) => void;
  trans: (conversion: Record<string, string>) => void;
}

declare global {
  interface Window {
    wcs?: Wcs;
    wcs_add?: Record<string, string>;
    wcs_do?: (extra?: unknown) => void;
  }
}

// 외부 스크립트라 컴포넌트 effect보다 늦게 로드될 수 있어 짧게 폴링한다.
// onLoad 콜백에 의존하지 않는 이유: 스크립트가 이미 캐시돼 있거나 다른 곳에서
// 먼저 삽입된 경우에도 동일하게 동작해야 한다.
const POLL_MS = 200;
const TIMEOUT_MS = 10_000;

/**
 * 조건이 충족되면 run을 1회 실행하고, 대기를 취소하는 정리 함수를 돌려준다.
 * 타임아웃이 지나면 조용히 포기한다 — 추적 실패가 화면 동작을 막으면 안 된다.
 */
function whenReady(ready: () => boolean, run: () => void): () => void {
  if (ready()) {
    run();
    return () => {};
  }

  let waited = 0;
  const timer = window.setInterval(() => {
    waited += POLL_MS;
    if (ready()) {
      window.clearInterval(timer);
      run();
    } else if (waited >= TIMEOUT_MS) {
      window.clearInterval(timer);
    }
  }, POLL_MS);

  return () => window.clearInterval(timer);
}

function wcsLoaded(): boolean {
  return Boolean(window.wcs && window.wcs_do);
}

// 전환은 PV 이후에만 나가야 하므로 발화 여부를 모듈 상태로 들고 있는다.
// (문서가 새로 로드되면 자연히 false로 돌아간다)
let pageViewSent = false;

/** 현재 URL의 PV 전송. 최초 진입과 라우트 변경 시마다 호출한다. */
export function sendNaverPageView(): () => void {
  return whenReady(wcsLoaded, () => {
    const wcs = window.wcs;
    const wcsDo = window.wcs_do;
    if (!wcs || !wcsDo) return;

    window.wcs_add = window.wcs_add ?? {};
    window.wcs_add.wa = NAVER_ACCOUNT_ID;
    wcs.inflow(INFLOW_DOMAIN);
    wcsDo();
    pageViewSent = true;
  });
}

/**
 * 전환 전송. 신청 완료 시점에 1회만 호출한다.
 * PV(wcs_do)가 먼저 나가야 하므로 PV 완료까지 기다린다.
 */
export function sendNaverConversion(type: NaverConversionType): () => void {
  return whenReady(
    () => wcsLoaded() && pageViewSent,
    () => window.wcs?.trans({ type }),
  );
}
