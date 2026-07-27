import Link from "next/link";

// 상단 고정 헤더 — 바 자체는 뷰포트 전폭, 내용만 480px 컬럼에 맞춘다.
// (하단 고정바와 동일한 규칙)
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-kb-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[480px] items-center justify-between px-5">
        <Link
          href="/"
          className="text-base font-extrabold tracking-[-0.02em] text-kb-black"
        >
          에이주식 연구소
        </Link>
        <Link
          href="/request"
          className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-[13px] font-bold text-kb-white transition-colors duration-150 hover:bg-brand-dark"
        >
          리포트 받기
        </Link>
      </div>
    </header>
  );
}
