// 네이버 파워링크/검색광고 유입 시 랜딩 URL에 붙는 검색 키워드 파라미터를 뽑아낸다.
// 우선순위: n_keyword(등록 키워드) → n_query(실제 검색어) → kw/keyword(테스트·수동 유입).
const KEYWORD_PARAMS = ["n_keyword", "n_query", "kw", "keyword"] as const;

// 배지는 한 줄 고정이라 모바일 최소 폭(360px)에서 넘치지 않을 길이로 자른다.
const MAX_LEN = 16;

export type SearchParamsInput = Record<string, string | string[] | undefined>;

// 네이버는 값을 한 번 더 인코딩해 붙이는 경우가 있어(%EC%82%BC...) 필요할 때만 재디코딩.
function decodeOnce(value: string): string {
  if (!/%[0-9A-Fa-f]{2}/.test(value)) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// 화면에 그대로 찍히는 값이므로 꺾쇠·제어문자를 걷어내고 길이를 제한한다.
function sanitize(value: string): string {
  return (
    decodeOnce(value)
      .replace(/[<>]/g, "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function clamp(value: string): string {
  return value.length > MAX_LEN ? `${value.slice(0, MAX_LEN)}…` : value;
}

/** 랜딩 진입 쿼리에서 "방금 ‘○○’ 검색하셨죠?"에 쓸 키워드를 추출한다. 없으면 null. */
export function resolveSearchKeyword(
  searchParams: SearchParamsInput | undefined,
): string | null {
  if (!searchParams) return null;

  for (const key of KEYWORD_PARAMS) {
    const raw = searchParams[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (!value) continue;

    const keyword = sanitize(value);
    if (keyword) return clamp(keyword);
  }

  return null;
}
