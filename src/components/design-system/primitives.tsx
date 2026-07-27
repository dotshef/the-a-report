import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  fill = false,
  bordered = true,
}: {
  children: ReactNode;
  className?: string;
  fill?: boolean;
  bordered?: boolean;
}) {
  return (
    <div
      className={[
        fill ? "bg-kb-fill rounded-[16px] p-8" : "bg-kb-white rounded-[12px] p-6",
        bordered && !fill ? "border border-kb-border" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Avatar({
  children,
  size = 40,
  bg = "var(--brand-primary)",
}: {
  children?: ReactNode;
  size?: number;
  bg?: string;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[12px]"
      style={{ width: size, height: size, background: bg }}
    >
      {children}
    </div>
  );
}

export function Chip({
  children,
  onClick,
  active = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex cursor-pointer items-center gap-1.5 rounded-[8px] px-3.5 py-2 text-sm font-semibold",
        "border-2 transition-all duration-300 ease-out hover:-translate-y-0.5",
        active
          ? "border-kb-black bg-kb-black text-kb-white"
          : "border-transparent bg-kb-fill text-kb-black hover:border-brand hover:text-brand",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function StatusPill({
  children,
  tone = "positive",
}: {
  children: ReactNode;
  tone?: "positive" | "critical" | "neutral";
}) {
  const tones = {
    positive: "text-kb-positive",
    critical: "text-kb-critical",
    neutral: "text-kb-black",
  } as const;
  const bg = {
    positive: "rgba(15,190,108,0.12)",
    critical: "rgba(224,32,0,0.12)",
    neutral: "var(--kb-surface-fill)",
  } as const;
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
      style={{ background: bg[tone] }}
    >
      {children}
    </span>
  );
}
