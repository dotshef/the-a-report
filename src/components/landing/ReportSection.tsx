"use client";

import { ReportPreview } from "@/components/report/ReportPreview";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import { useSelection } from "./selection-context";

// 리포트 미리보기 — 로딩 중 스켈레톤, 완료 시 미리보기.
export function ReportSection() {
  const { report, loading } = useSelection();

  if (loading) {
    return (
      <div className="px-5">
        <ReportSkeleton />
      </div>
    );
  }

  if (report) {
    return (
      <div key={report.stock.code} className="kb-reveal px-5">
        <ReportPreview report={report} />
      </div>
    );
  }

  return null;
}
