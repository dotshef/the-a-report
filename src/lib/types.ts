import type { Stock } from "@/data/stock";
import type { ReportCategory } from "@/data/report-titles";

export interface StockQuote {
  code: string;
  price: number;
  change: number;
  changeRate: number;
  high: number;
  low: number;
  high52w: number;
  low52w: number;
  /** 오름차순 */
  history: { date: string; close: number }[];
  /** price_daily 최신 행의 date(종가 기준). 빈 문자열=데이터 없음 */
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
  /** 마스킹 대상 */
  conclusion: string;
  /** 마스킹 대상 */
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
  /** KIS 원문: 매수/중립 등 */
  opinion: string;
  price: number;
}

export interface TickerItem {
  code: string;
  name: string;
  price: number;
  /** 전일 대비 (%) */
  changeRate: number;
}

export interface TickerData {
  items: TickerItem[];
  /** 기준 거래일 (price_daily 최신 date). 종가 기준임을 티커에 표기하는 데 쓴다. */
  asOf: string;
}
