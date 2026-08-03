// 광고 유입 정보(ad attribution) 수집 — docs/광고-유입-정보-수집-전략.md 구현.
//
// 원칙
//  1. 최초 진입 URL에서 1회만 캡처한다. 사이트 내 이동(랜딩 → /request)이 끼면
//     쿼리스트링이 사라져 폼 제출 시점에는 파라미터가 남아 있지 않다.
//  2. sessionStorage에 보관한다. 같은 탭 = 한 번의 방문.
//  3. 매체(source)를 먼저 판정하고, 그다음 매체별 필드를 뽑는다.
//     구글과 네이버는 파라미터 체계가 완전히 달라 매체 없이는 어떤 필드도 못 믿는다.
//  4. unknown은 매체 정보를 저장하지 않는다 — 저장해버리면 나중에 광고 링크로
//     재진입해도 최초의 unknown이 계속 남는다.
//  5. landing_url만은 매체 판정과 분리해 "항상" 남긴다. 판정에 실패한 유입의 원본
//     URL이 있어야 어떤 파라미터로 들어왔는지 사후에 확인하고 판정 규칙을 넓힐 수 있다.
//     (이전 구현은 unknown이면 landing_url까지 버려서, 판정 실패의 원인을 볼 수 없었다)
//  6. 유입 정보가 없어도 리드는 정상 접수된다. 부가 기능이 본 기능을 막으면 안 된다.
//
// 서버(Server Action)는 이 파일의 normalize* 함수로 값을 다시 정규화한다 —
// 폼 payload는 위조 가능하므로 클라이언트 판정을 그대로 믿지 않는다.

export const TRAFFIC_SOURCES = ["google", "naver", "unknown"] as const;
export type TrafficSource = (typeof TRAFFIC_SOURCES)[number];

export interface AdAttribution {
  traffic_source: TrafficSource;
  ad_keyword: string;
  ad_campaign_id: string;
  ad_campaign_label: string;
  landing_url: string;
}

export const TRACKING_KEYS = [
  "traffic_source",
  "ad_keyword",
  "ad_campaign_id",
  "ad_campaign_label",
  "landing_url",
] as const;

// 클라이언트·서버 양쪽에 동일하게 적용하는 길이 제한.
export const MAX_KEYWORD = 200;
export const MAX_CAMPAIGN = 100;
export const MAX_LANDING_URL = 2000;

// 같은 도메인에 랜딩이 여러 개 있어도 충돌하지 않도록 프로젝트 고유 키를 쓴다.
const STORE_KEY = "areport:ad-attribution";
// landing_url은 매체 판정 성공 여부와 무관하게 남겨야 하므로 키를 분리한다.
// 한 키에 묶으면 "unknown은 저장 안 함" 규칙에 landing_url까지 딸려 날아간다.
const LANDING_KEY = "areport:landing-url";

// 매체 판정 파라미터 — 값은 보지 않고 "존재 여부"만 본다.
//
// 고정 목록만으로는 실제 유입을 못 잡는다. 네이버는 검색광고 추적 URL 설정에 따라
// n_media 없이 n_query/n_keyword만 붙기도 하고, 구글은 gad_source처럼 새 파라미터가
// 계속 늘어난다. 그래서 접두사(n_ / gad_) 규칙을 함께 둔다.
const GOOGLE_KEYS = ["gclid", "gbraid", "wbraid", "gclsrc"];
const GOOGLE_PREFIXES = ["gad_"];
const NAVER_KEYS = ["napm", "ncisy"];
const NAVER_PREFIXES = ["n_"];

// 네이버 검색어. n_query(실제 검색어)가 n_keyword(등록 키워드)보다 정확하므로 우선한다.
// kw/keyword는 수동 태깅·테스트 유입용 — lib/naver-keyword.ts의 배지와 같은 후보군을
// 보되 우선순위만 다르다(배지는 노출용이라 등록 키워드가 더 깔끔하다).
const NAVER_KEYWORD_PARAMS = ["n_query", "n_keyword", "kw", "keyword"];
// 구글은 자동 태깅으로 검색어를 주지 않는다. 최종 URL 접미어에 {keyword} ValueTrack을
// 심어 utm_term/keyword로 넘길 때만 채워진다.
const GOOGLE_KEYWORD_PARAMS = ["utm_term", "keyword"];
const GOOGLE_CAMPAIGN_ID_PARAMS = ["gad_campaignid", "utm_id"];
const GOOGLE_CAMPAIGN_LABEL_PARAMS = ["c", "utm_campaign", "utm_content"];

const UNKNOWN: AdAttribution = {
  traffic_source: "unknown",
  ad_keyword: "",
  ad_campaign_id: "",
  ad_campaign_label: "",
  landing_url: "",
};

function clip(value: string | undefined | null, max: number): string {
  return (value ?? "").trim().slice(0, max);
}

// 후보 파라미터를 순서대로 훑어 처음 채워진 값을 쓴다.
function pick(p: Map<string, string>, keys: string[], max: number): string {
  for (const key of keys) {
    const value = clip(p.get(key), max);
    if (value) return value;
  }
  return "";
}

// 매체가 파라미터 대소문자를 섞어 보낸다(네이버는 NaPm, 문서 표기는 napm).
// 판정이 표기 흔들림에 걸려 넘어지지 않도록 키를 소문자로 눕혀 조회한다.
function lowerCaseParams(search: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const [key, value] of new URLSearchParams(search)) {
    const k = key.toLowerCase();
    if (!map.has(k)) map.set(k, value);
  }
  return map;
}

function hasMarker(
  p: Map<string, string>,
  keys: string[],
  prefixes: string[],
): boolean {
  if (keys.some((k) => p.has(k))) return true;
  for (const key of p.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) return true;
  }
  return false;
}

/**
 * 진입 URL에서 광고 유입 정보를 판정한다.
 * 구글/네이버 마커가 둘 다 없거나 둘 다 있으면(파라미터 오염) unknown —
 * 잘못된 매체로 집계하느니 미상이 낫다.
 * 단 landing_url은 unknown이어도 채운다(원칙 5).
 */
export function detectAdAttribution(search: string, href: string): AdAttribution {
  const p = lowerCaseParams(search);
  const landing_url = clip(href, MAX_LANDING_URL);

  let isGoogle = hasMarker(p, GOOGLE_KEYS, GOOGLE_PREFIXES);
  let isNaver = hasMarker(p, NAVER_KEYS, NAVER_PREFIXES);

  // 매체 고유 파라미터가 하나도 없어도 직접 심은 utm_source는 신뢰한다.
  // (마커가 둘 다 잡힌 오염 케이스는 여기서 구제하지 않는다 — 그대로 unknown)
  if (!isGoogle && !isNaver) {
    const utm = clip(p.get("utm_source"), 50).toLowerCase();
    if (utm.includes("google")) isGoogle = true;
    else if (utm.includes("naver")) isNaver = true;
  }

  if (isGoogle === isNaver) return { ...UNKNOWN, landing_url };

  // 구글은 키워드를 URL로 넘겨주지 않는다(필요하면 최종 URL에 {keyword} ValueTrack을
  // 직접 심어야 한다). 대신 자동 태깅 캠페인 ID와 최종 URL에 심은 라벨(c=)을 받는다.
  if (isGoogle) {
    return {
      traffic_source: "google",
      ad_keyword: pick(p, GOOGLE_KEYWORD_PARAMS, MAX_KEYWORD),
      ad_campaign_id: pick(p, GOOGLE_CAMPAIGN_ID_PARAMS, MAX_CAMPAIGN),
      ad_campaign_label: pick(p, GOOGLE_CAMPAIGN_LABEL_PARAMS, MAX_CAMPAIGN),
      landing_url,
    };
  }

  // 네이버는 캠페인 ID 대신 검색어를 그대로 준다. 비대칭이 정상이다.
  return {
    traffic_source: "naver",
    ad_keyword: pick(p, NAVER_KEYWORD_PARAMS, MAX_KEYWORD),
    ad_campaign_id: "",
    ad_campaign_label: "",
    landing_url,
  };
}

/* ------------------------------- 클라이언트 ------------------------------- */

// 최초 진입 시 1회 캡처. sessionStorage 차단(시크릿 모드 등)돼도 신청은 계속 동작해야
// 하므로 전체를 try/catch로 감싼다.
export function captureAdAttribution(): void {
  try {
    // landing_url은 매체 판정과 무관하게 최초 진입 URL을 고정한다.
    if (!sessionStorage.getItem(LANDING_KEY)) {
      sessionStorage.setItem(
        LANDING_KEY,
        clip(window.location.href, MAX_LANDING_URL),
      );
    }

    if (sessionStorage.getItem(STORE_KEY)) return;

    const attr = detectAdAttribution(
      window.location.search,
      window.location.href,
    );
    if (attr.traffic_source === "unknown") return;

    sessionStorage.setItem(STORE_KEY, JSON.stringify(attr));
  } catch {
    // 유입 추적 실패가 리드 수집을 막지 않는다.
  }
}

function storedLandingUrl(): string {
  try {
    return clip(sessionStorage.getItem(LANDING_KEY), MAX_LANDING_URL);
  } catch {
    return "";
  }
}

// 폼 제출용 값. 보관된 JSON이 손상됐을 수 있으므로 읽을 때도 매체별로 필드를
// 재구성하고, 보관된 값이 없으면 현재 URL로 한 번 더 판정한다(랜딩에서 바로 제출한 경우).
export function readAdAttribution(): AdAttribution {
  let stored: Partial<AdAttribution> | null = null;
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (raw) stored = JSON.parse(raw) as Partial<AdAttribution>;
  } catch {
    stored = null;
  }

  // 보관된 최초 진입 URL이 우선. sessionStorage가 막혔으면 현재 URL이라도 남긴다.
  const landing_url =
    storedLandingUrl() || clip(window.location.href, MAX_LANDING_URL);

  const source = normalizeTrafficSource(stored?.traffic_source);
  const attribution =
    source === "unknown"
      ? detectAdAttribution(window.location.search, window.location.href)
      : isolateBySource(source, stored ?? {});

  return { ...attribution, landing_url };
}

/* --------------------------------- 서버 --------------------------------- */

export function normalizeTrafficSource(value: unknown): TrafficSource {
  return TRAFFIC_SOURCES.includes(value as TrafficSource)
    ? (value as TrafficSource)
    : "unknown";
}

/**
 * 매체별 필드 격리 — 데이터 정합성의 마지막 방어선.
 * 클라이언트가 어떤 조합을 보내든 "매체와 모순되지 않는 값"만 남긴다.
 * (네이버 유입인데 ad_campaign_id가 실려 오면 버린다)
 *
 * landing_url은 매체와 무관한 원본 보존용이므로 unknown 포함 항상 통과시킨다.
 */
export function isolateBySource(
  source: TrafficSource,
  raw: Partial<Record<(typeof TRACKING_KEYS)[number], string>>,
): AdAttribution {
  const landing_url = clip(raw.landing_url, MAX_LANDING_URL);
  if (source === "unknown") return { ...UNKNOWN, landing_url };

  return {
    traffic_source: source,
    ad_keyword: clip(raw.ad_keyword, MAX_KEYWORD),
    ad_campaign_id:
      source === "google" ? clip(raw.ad_campaign_id, MAX_CAMPAIGN) : "",
    ad_campaign_label:
      source === "google" ? clip(raw.ad_campaign_label, MAX_CAMPAIGN) : "",
    landing_url,
  };
}
