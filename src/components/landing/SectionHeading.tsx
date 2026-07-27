import type { ReactNode } from "react";

// 메인 2단 구성(① 리포트 받으실 정보 / ② 분석 리포트 선택 & 미리보기)의 번호 라벨.
export function SectionHeading({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-kb-white">
        {step}
      </span>
      <h2 className="text-sm font-bold text-brand-strong">{children}</h2>
    </div>
  );
}
