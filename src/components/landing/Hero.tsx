import { Avatar } from "@/components/design-system/primitives";
import { Icon } from "@/components/design-system/Icon";

export function Hero() {
  return (
    <header className="flex flex-col gap-4 px-5 pt-10 pb-0">
      <div className="flex items-center gap-2">
        <Avatar size={32}>
          <Icon name="chart" size={18} color="var(--kb-black)" />
        </Avatar>
        <span className="text-sm font-semibold">오늘의 종목 리포트</span>
      </div>

      <h1 className="text-[32px] font-extrabold leading-[1.2] tracking-[-0.02em]">
        궁금한 그 종목,
        <br />
        <span className="bg-[linear-gradient(to_top,var(--kb-yellow-signal)_0,var(--kb-yellow-signal)_34%,transparent_34%)] px-0.5">
          무료 분석 리포트
        </span>
        로 확인하세요
      </h1>

      <p className="text-base leading-relaxed text-kb-gray">
        국내 상장 전 종목 검색 가능 · 선택 즉시 리포트 미리보기 제공
      </p>
    </header>
  );
}
