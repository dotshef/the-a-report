// 종목 타입 + 시장 라벨. 실데이터는 DB(public.stock)에서 읽는다(사용자 적재).

export interface Stock {
  /** 종목번호 (6자리) */
  code: string;
  /** 회사 이름 */
  name: string;
  /** 거래시장 — DB char(1): 'K'=KOSPI, 'Q'=KOSDAQ */
  market: string;
  /** 산업 */
  industry?: string;
}

// 거래시장 표시명. DB는 'K'/'Q' (레퍼런스 stock.market 인코딩).
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

// 보통주 일반종목 판정 — 규칙은 앱(서버 로직)이 소유한다.
// 주권(ST)이면서 종목코드 끝자리가 '0'(우선주·리츠 등 제외).
// PRD: 검색/트렌딩 대상인 "일반 종목"(코스피 833 + 코스닥 1,818).
export function isCommonStock(code: string, groupCode: string): boolean {
  return groupCode === "ST" && code.endsWith("0");
}
