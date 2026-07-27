import { SearchKeywordPill } from "@/components/landing/SearchKeywordPill";

export function Hero({ keyword }: { keyword?: string | null }) {
  return (
    <section className="flex flex-col gap-4 px-5 pt-6 pb-0">
      {/* 네이버 검색 유입일 때만 노출 — 키워드가 없으면 배지 자체가 없다 */}
      {keyword ? <SearchKeywordPill keyword={keyword} /> : null}

      <h1 className="text-[30px] font-extrabold leading-[1.28] tracking-[-0.02em]">
        ‘<span className="text-brand">그 종목</span>’, 지금이 기회일까?
        <br />
        답은 <span className="text-brand">리포트</span> 안에 있습니다
      </h1>

      <p className="text-[13px] leading-relaxed text-kb-cool-gray">
        <b className="font-semibold text-kb-black">지금 왜 이 자리인지</b>,{" "}
        <b className="font-semibold text-kb-black">앞으로 어떻게 볼지</b> — 내
        종목 리포트로 확인하세요.
      </p>
    </section>
  );
}
