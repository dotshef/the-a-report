import type { LandingStats } from "@/lib/stats";
import { won } from "@/lib/format";

// 오늘 신청자(사회적 증거) + 발송 리듬. 인위적 희소성·긴박감 없이 사실만 전달한다.
export function StatsBar({ stats }: { stats: LandingStats }) {
  return (
    <div className="px-5">
      <div className="grid grid-cols-2 overflow-hidden rounded-[16px] bg-kb-fill">
        <div className="flex flex-col items-center gap-1 p-5">
          <span className="text-xs text-kb-gray">오늘 신청자</span>
          <span className="amount text-2xl">{won(stats.todayApplicants)}명</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-l border-kb-border p-5">
          <span className="text-xs text-kb-gray">리포트 발송</span>
          <span className="amount text-2xl">매일 저녁</span>
        </div>
      </div>
    </div>
  );
}
