import { Icon } from "@/components/design-system/Icon";

/**
 * 네이버 검색 유입 시에만 노출되는 인지 배지.
 * "방금 ‘주가전망’ 검색하셨죠?" — 방금의 검색 의도를 그대로 되짚어 준다.
 */
export function SearchKeywordPill({ keyword }: { keyword: string }) {
  return (
    <span className="inline-flex w-fit items-center gap-[7px] rounded-full border border-brand-border bg-brand-surface py-1.5 px-3 text-[12.5px] font-bold text-brand-strong">
      <span className="kb-pulse" aria-hidden="true" />
      <Icon name="search" size={14} strokeWidth={2.4} />
      <span className="whitespace-nowrap">
        방금 ‘<span className="text-brand">{keyword}</span>’ 검색하셨죠?
      </span>
    </span>
  );
}
