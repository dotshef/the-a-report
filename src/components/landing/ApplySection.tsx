"use client";

import { Icon } from "@/components/design-system/Icon";
import { SectionHeading } from "./SectionHeading";
import { LeadForm } from "./LeadForm";
import { useSelection } from "./selection-context";

// ① 리포트 받으실 정보 — 이름·전화번호·동의·신청까지 한 카드에서 끝낸다.
// 종목 선택(칩·검색)은 ② 분석 리포트 선택 & 미리보기 섹션에 있다.
export function ApplySection() {
  const { selected } = useSelection();

  return (
    <section id="apply" className="scroll-mt-[68px] px-5">
      <div className="flex flex-col gap-4 rounded-[16px] border border-kb-border bg-kb-white p-5">
        <SectionHeading step={1}>리포트 받으실 정보</SectionHeading>

        <p className="flex items-center gap-1.5 text-xs">
          {selected ? (
            <>
              <Icon name="check" size={14} color="var(--brand-primary)" />
              <span className="text-brand-strong">
                <b className="font-bold">{selected.name}</b> 리포트로 신청합니다
              </span>
            </>
          ) : (
            <span className="text-kb-gray">
              아래 ② 에서 종목을 고르면 해당 리포트로 신청됩니다.
            </span>
          )}
        </p>

        <LeadForm
          embedded
          selectedCode={selected?.code}
          selectedName={selected?.name}
        />
      </div>
    </section>
  );
}
