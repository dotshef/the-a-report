import type { Stock } from "@/data/stock";
import type { ReportCategory } from "@/data/report-titles";

export interface StockQuote {
  code: string;
  /** 현재가 */
  price: number;
  /** 전일 대비 */
  change: number;
  /** 등락률 (%) */
  changeRate: number;
  /** 당일 고가 */
  high: number;
  /** 당일 저가 */
  low: number;
  /** 52주 최고 */
  high52w: number;
  /** 52주 최저 */
  low52w: number;
  /** 3개월 종가 시계열 (오름차순) */
  history: { date: string; close: number }[];
  /** 시세 기준 거래일 (price_daily 최신 행의 date, 종가 기준). 빈 문자열=데이터 없음 */
  updatedAt: string;
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  url: string;
}

export interface ReportSection {
  title: string;
  category: ReportCategory;
  /** 한 줄 결론 — 마스킹 대상 */
  conclusion: string;
  /** 분석 결과 — 마스킹 대상 */
  analysis: string;
  news: NewsItem[];
}

export interface ReportData {
  stock: Stock;
  quote: StockQuote;
  sections: ReportSection[];
}

export interface TrendingStock {
  stock: Stock;
  /** 투자의견 (KIS: 매수/중립 등) */
  opinion: string;
  price: number;
}

/** 상단 시세 티커 한 칸 — top_view 종목의 종목명·종가·등락률 */
export interface TickerItem {
  code: string;
  name: string;
  /** 최신 종가 */
  price: number;
  /** 전일 대비 등락률 (%) */
  changeRate: number;
}

export interface TickerData {
  items: TickerItem[];
  /** 기준 거래일 (price_daily 최신 date). 종가 기준임을 티커에 표기하는 데 쓴다. */
  asOf: string;
}
