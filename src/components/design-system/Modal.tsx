"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

// 디자인 시스템 모달 — 모바일에선 바텀시트, 데스크톱에선 중앙 카드.
// 백드롭/ESC로 닫히고, 열렸을 때 배경 스크롤을 잠근다.
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div
        className="absolute inset-0 cursor-pointer bg-kb-black/40 animate-[fadeIn_150ms_ease-out]"
        onClick={onClose}
      />
      <div
        className={[
          "relative flex max-h-[85vh] w-full flex-col bg-kb-white sm:w-[440px]",
          "rounded-t-[20px] sm:rounded-[20px]",
          "animate-[sheetUp_220ms_cubic-bezier(0.16,1,0.3,1)]",
        ].join(" ")}
      >
        <header className="flex items-center justify-between gap-3 border-b border-kb-border px-5 py-4">
          <h3 className="text-base font-bold text-kb-black">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-kb-gray transition-colors hover:bg-kb-fill hover:text-kb-black"
          >
            <Icon name="close" size={20} />
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-4 text-sm leading-relaxed text-kb-black">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
