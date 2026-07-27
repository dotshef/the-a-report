// 종목 타입 + 시장 라벨. 실데이터는 DB(public.stock)에서 읽는다(사용자 적재).

export interface Stock {
  /** 6자리 */
  code: string;
  name: string;
  /** DB char(1): 'K'=KOSPI, 'Q'=KOSDAQ */
  market: string;
  industry?: string;
}

const MARKET_LABEL: Record<string, string> = {
  K: "코스피",
  Q: "코스닥",
  N: "코넥스",
  // 라벨형 폴백
  KOSPI: "코스피",
  KOSDAQ: "코스닥",
};

export function marketLabel(market: string): string {
  return MARKET_LABEL[market] ?? market;
}

// 검색·트렌딩 대상 판정. 주권(ST)이면서 종목코드 끝자리가 '0'(우선주·리츠 등 제외).
// 규칙은 DB 파생 컬럼이 아니라 앱이 소유한다.
export function isCommonStock(code: string, groupCode: string): boolean {
  return groupCode === "ST" && code.endsWith("0");
}
