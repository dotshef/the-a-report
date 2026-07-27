import { Card } from "@/components/design-system/primitives";

// 리포트 로딩 중 자리표시자 — ReportPreview의 형태를 본떠 shimmer로 표시.
export function ReportSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <Card className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-kb-border p-5">
          <div className="flex items-baseline gap-2">
            <div className="kb-skeleton h-6 w-28" />
            <div className="kb-skeleton h-4 w-14" />
          </div>
          <div className="kb-skeleton h-3.5 w-32" />
          <div className="mt-2 flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <div className="kb-skeleton h-8 w-40" />
              <div className="kb-skeleton h-4 w-28" />
            </div>
            <div className="kb-skeleton h-3.5 w-24" />
          </div>
        </div>

        <div className="px-3 pt-3">
          <div className="kb-skeleton h-40 w-full !rounded-[12px]" />
        </div>

        <div className="grid grid-cols-4 gap-2 p-5 pt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="kb-skeleton h-3 w-10" />
              <div className="kb-skeleton h-4 w-14" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="kb-skeleton h-3 w-16" />
          <div className="kb-skeleton h-5 w-3/4" />
        </div>
        <div className="kb-skeleton h-9 w-full !rounded-[8px]" />
        <div className="flex flex-col gap-2">
          <div className="kb-skeleton h-3 w-24" />
          <div className="kb-skeleton h-20 w-full !rounded-[12px]" />
        </div>
      </Card>
    </div>
  );
}
