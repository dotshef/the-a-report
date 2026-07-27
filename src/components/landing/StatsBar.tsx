import type { LandingStats } from "@/lib/stats";
import { won } from "@/lib/format";

// 오늘 신청자(사회적 증거) + 이번 주 무료 발송 잔여. 사실 기반 수치만 노출한다.
export function StatsBar({ stats }: { stats: LandingStats }) {
  return (
    <div className="px-5">
      {/* 그린 히어로 밴드 위에 얹히므로 회색 fill 대신 흰 면 + 브랜드 보더 */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[16px] border border-brand-border bg-kb-white px-4 py-3.5 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kb-positive opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-kb-positive" />
        </span>
        <span className="text-kb-gray">
          오늘 <b className="font-bold text-kb-black">{won(stats.todayApplicants)}</b>명 신청
        </span>
        <span className="h-3 w-px bg-kb-border" />
        <span className="font-semibold text-kb-critical">
          이번 주 무료 발송분 잔여 <b className="font-bold text-kb-black">{won(stats.weeklyFreeRemaining)}</b>건
        </span>
      </div>
    </div>
  );
}
