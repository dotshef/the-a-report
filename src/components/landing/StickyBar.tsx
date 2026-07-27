"use client";

import Link from "next/link";
import { useSelection } from "./selection-context";

// 하단 고정바 — 상단 헤더와 동일하게 리포트 신청 페이지로 보낸다.
// 종목이 선택돼 있으면 그대로 넘겨 /request에서 다시 고르지 않게 한다.
export function StickyBar() {
  const { selected } = useSelection();
  const href = selected
    ? `/request?${new URLSearchParams({ code: selected.code, name: selected.name })}`
    : "/request";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-kb-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[480px] items-center gap-3 px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">신청하면 담당자가 연락드려요</p>
          <p className="truncate text-xs text-kb-gray">이름·전화번호만 남기면 끝</p>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-brand px-5 text-base font-semibold text-kb-white transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] select-none hover:bg-brand-dark active:opacity-85"
        >
          리포트 받기 →
        </Link>
      </div>
    </div>
  );
}
