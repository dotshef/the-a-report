import { LandingClient } from "@/components/landing/LandingClient";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { getTrending } from "@/data/loader";
import { getStats } from "@/lib/stats";

// 세로로 긴 모바일 친화 랜딩 (PRD L2). 매 요청마다 시세/통계 갱신.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [trending, stats] = await Promise.all([
    getTrending(8),
    Promise.resolve(getStats()),
  ]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-8 bg-white pb-16 shadow-[0_0_60px_rgba(0,0,0,0.06)]">
      <LandingClient trending={trending} stats={stats} />
      <SiteFooter />
    </main>
  );
}
