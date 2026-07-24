// Report titles + classification — EMBEDDED IN CODE, not stored in DB (PRD).
//
// PRD AI 작업:
//  - 1차: 개발 시 멀티 에이전트로 2,651개사 × 2개 = 5,302개 제목을 "~일까?"
//         의문문 형식으로 생성.
//  - 2차: 제목을 기반으로 AI가 분류(category)를 판단하여 삽입.
//
// For this build the 5,302 titles are represented by a deterministic,
// industry-aware generator (below). When the real AI-generated title set
// is produced, replace `generateTitles` with a static lookup table keyed
// by stock code — the ReportTitle shape stays identical.

export type ReportCategory =
  | "실적"
  | "성장성"
  | "밸류에이션"
  | "수급·모멘텀"
  | "산업·정책"
  | "리스크";

export interface ReportTitle {
  /** 리포트 제목 (의문문, "~일까?") */
  title: string;
  /** AI 분류 */
  category: ReportCategory;
}

// Industry → two question templates + their category.
const TEMPLATES: Record<string, { title: (n: string) => string; category: ReportCategory }[]> = {
  반도체: [
    { title: (n) => `${n}, HBM 사이클의 최대 수혜주일까?`, category: "성장성" },
    { title: (n) => `${n}의 다음 분기 실적은 시장 기대를 넘을 수 있을까?`, category: "실적" },
  ],
  "2차전지": [
    { title: (n) => `${n}, 전기차 캐즘을 지나 다시 반등할 수 있을까?`, category: "산업·정책" },
    { title: (n) => `${n}의 현재 주가는 성장성 대비 저평가일까?`, category: "밸류에이션" },
  ],
  "2차전지소재": [
    { title: (n) => `${n}, 양극재 판가 하락은 언제 멈출까?`, category: "산업·정책" },
    { title: (n) => `${n}의 실적 바닥은 지나갔을까?`, category: "실적" },
  ],
  바이오: [
    { title: (n) => `${n}, 파이프라인 기대감은 주가에 얼마나 반영됐을까?`, category: "밸류에이션" },
    { title: (n) => `${n}의 임상 모멘텀은 이어질 수 있을까?`, category: "수급·모멘텀" },
  ],
  자동차: [
    { title: (n) => `${n}, 하이브리드 강세가 실적을 계속 끌어올릴까?`, category: "실적" },
    { title: (n) => `${n}의 밸류에이션은 글로벌 경쟁사 대비 매력적일까?`, category: "밸류에이션" },
  ],
  인터넷: [
    { title: (n) => `${n}, AI 서비스가 새로운 성장 동력이 될까?`, category: "성장성" },
    { title: (n) => `${n}의 광고·커머스 회복은 실적으로 이어질까?`, category: "실적" },
  ],
  게임: [
    { title: (n) => `${n}, 신작 흥행이 주가 반등을 이끌까?`, category: "수급·모멘텀" },
    { title: (n) => `${n}의 실적은 신작 공백기를 견딜 수 있을까?`, category: "실적" },
  ],
  엔터테인먼트: [
    { title: (n) => `${n}, 아티스트 컴백 사이클이 실적을 끌어올릴까?`, category: "실적" },
    { title: (n) => `${n}의 글로벌 팬덤 확장은 지속될까?`, category: "성장성" },
  ],
  금융지주: [
    { title: (n) => `${n}, 밸류업 정책의 대표 수혜주가 될 수 있을까?`, category: "산업·정책" },
    { title: (n) => `${n}의 배당 매력은 금리 인하기에도 유효할까?`, category: "밸류에이션" },
  ],
  은행: [
    { title: (n) => `${n}, 플랫폼 성장세가 은행 밸류에이션을 넘어설까?`, category: "성장성" },
    { title: (n) => `${n}의 순이자마진은 방어될 수 있을까?`, category: "실적" },
  ],
  통신: [
    { title: (n) => `${n}, 배당주로서의 매력은 여전할까?`, category: "밸류에이션" },
    { title: (n) => `${n}의 AI·데이터센터 사업은 성장할 수 있을까?`, category: "성장성" },
  ],
  로봇: [
    { title: (n) => `${n}, 휴머노이드 테마의 중심에 설 수 있을까?`, category: "수급·모멘텀" },
    { title: (n) => `${n}의 실적은 밸류에이션을 정당화할 수 있을까?`, category: "밸류에이션" },
  ],
};

// Generic fallback templates keyed off any industry.
function fallback(name: string, industry: string): ReportTitle[] {
  return [
    { title: `${name}, ${industry} 업황 반등의 수혜를 볼 수 있을까?`, category: "산업·정책" },
    { title: `${name}의 현재 주가는 지금 사도 늦지 않았을까?`, category: "밸류에이션" },
  ];
}

/** 종목당 2개의 리포트 제목 + 분류 반환. 종목의 name/industry로 생성. */
export function generateTitles(stock: { name: string; industry?: string }): ReportTitle[] {
  const industry = stock.industry ?? "";
  const t = TEMPLATES[industry];
  if (t) return t.map((x) => ({ title: x.title(stock.name), category: x.category }));
  return fallback(stock.name, industry || "해당 업종");
}
