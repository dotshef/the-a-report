// 서비스 정식 도메인 — SEO 메타데이터와 리드 트래킹(landing_url)이 공유하는 단일 출처.
// 프리뷰 배포 등에서 다른 호스트를 쓰려면 NEXT_PUBLIC_SITE_URL 로 덮어쓴다.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.theareport.com"
).replace(/\/$/, "");

export const SITE_NAME = "에이주식 연구소";

// 상대 경로를 정식 도메인 기준 절대 URL로.
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
