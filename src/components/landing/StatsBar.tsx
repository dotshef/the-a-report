import type { LandingStats } from "@/lib/stats";
import { won } from "@/lib/format";

export function StatsBar({ stats }: { stats: LandingStats }) {
  return (
    <div className="px-5">
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
