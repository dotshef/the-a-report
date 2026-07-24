import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { LandingClient } from "@/components/landing/LandingClient";
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
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-8 bg-white pb-16">
      <Hero />
      <StatsBar stats={stats} />
      <LandingClient trending={trending} />

      <footer className="mt-4 flex flex-col gap-3 px-5 text-xs leading-relaxed text-kb-gray">
        <div className="rounded-[12px] bg-kb-fill p-4">
          <p>
            <span className="font-semibold text-kb-black">[투자 유의사항]</span> 본 서비스는
            자본시장법에 따라 신고된 유사투자자문업자가 불특정 다수를 대상으로 제공하는 투자
            참고 정보입니다. 제공 리포트는 참고용이며 매매를 권유하거나 수익을 보장하지 않습니다.
            금융투자상품은 원금 손실이 발생할 수 있고, 투자 판단과 책임은 투자자 본인에게 있습니다.
          </p>
          <p className="mt-2">
            <span className="font-semibold text-kb-black">[개인정보 수집·이용]</span> 수집항목:
            이름·전화번호·관심종목 / 목적: 리포트 발송 및 투자정보 안내 / 보유기간: 수집일로부터
            [○년] 또는 동의 철회 시까지. 동의를 거부할 수 있으며 거부 시 신청이 제한됩니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span>
            <span className="font-semibold text-kb-black">상호</span> [업체명]
          </span>
          <span>
            <span className="font-semibold text-kb-black">대표</span> [대표자명]
          </span>
          <span>
            <span className="font-semibold text-kb-black">유사투자자문업 신고</span> [제0000-00호]
          </span>
          <span>
            <span className="font-semibold text-kb-black">사업자</span> [000-00-00000]
          </span>
          <span>
            <span className="font-semibold text-kb-black">문의</span> [1600-0000]
          </span>
        </div>
        <p className="text-kb-light-gray">시세 데이터: 한국투자증권 API</p>
      </footer>
    </main>
  );
}
