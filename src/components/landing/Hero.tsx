import { Avatar } from "@/components/design-system/primitives";
import { Icon } from "@/components/design-system/Icon";

export function Hero() {
  return (
    <header className="flex flex-col gap-4 px-5 pt-10 pb-6">
      <div className="flex items-center gap-2">
        <Avatar size={32}>
          <Icon name="chart" size={18} color="var(--kb-black)" />
        </Avatar>
        <span className="text-sm font-semibold">오늘의 종목 리포트</span>
      </div>

      <h1 className="text-[32px] font-extrabold leading-[1.2] tracking-[-0.02em]">
        궁금한 종목,
        <br />
        오늘 저녁 리포트로
        <br />
        <span className="bg-[linear-gradient(to_top,var(--kb-yellow)_0,var(--kb-yellow)_34%,transparent_34%)] px-0.5">
          무료로
        </span>{" "}
        받아보세요
      </h1>

      <p className="text-base leading-relaxed text-kb-gray">
        코스피·코스닥 2,651개 종목의 시세와 AI 리포트를
        <br />
        매일 저녁 문자로 보내드려요.
      </p>
    </header>
  );
}
