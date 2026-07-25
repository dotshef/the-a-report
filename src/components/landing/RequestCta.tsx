"use client";

import { Button } from "@/components/design-system/Button";
import { Icon } from "@/components/design-system/Icon";
import { useSelection } from "./selection-context";

// 전체 리포트 신청 CTA — 종목 선택 시 활성화, /request 로 이동.
export function RequestCta() {
  const { selected, goToRequest } = useSelection();

  return (
    <div className="flex flex-col gap-3 px-5">
      <Button
        fullWidth
        disabled={!selected}
        onClick={goToRequest}
        className="group relative h-14 overflow-hidden text-[17px] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[160%] before:skew-x-[-22deg] before:bg-gradient-to-r before:from-transparent before:via-white/45 before:to-transparent before:transition-transform before:duration-700 before:ease-out enabled:hover:before:translate-x-[420%]"
      >
        <span className="relative inline-flex size-[18px] items-center justify-center">
          <Icon
            name="lock"
            size={18}
            color={selected ? "var(--kb-black)" : "var(--kb-light-gray)"}
            className="transition-opacity duration-150 group-enabled:group-hover:opacity-0"
          />
          <Icon
            name="lock-open"
            size={18}
            color={selected ? "var(--kb-black)" : "var(--kb-light-gray)"}
            className="absolute inset-0 opacity-0 transition-opacity duration-150 group-enabled:group-hover:opacity-100"
          />
        </span>
        전체 리포트 무료로 받기 →
      </Button>
      <p className="text-center text-xs text-kb-gray">
        종목 선택·미리보기만으로는 어떤 비용도 발생하지 않습니다.
      </p>
    </div>
  );
}
