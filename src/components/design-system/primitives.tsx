import type { ReactNode } from "react";

// ----- Card: white surface, 12px radius, optional 1px #E6E6E6 border, no shadow -----
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

// ----- Avatar: rounded square (12px), never a circle -----
export function Avatar({
  children,
  size = 40,
  bg = "var(--kb-yellow)",
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

// ----- Chip: 8px radius tight chip for trending stocks -----
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
        "inline-flex items-center gap-1.5 rounded-[8px] px-3.5 py-2 text-sm font-semibold",
        "transition-colors duration-150",
        active
          ? "bg-kb-black text-kb-white"
          : "bg-kb-fill text-kb-black hover:bg-kb-border",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ----- StatusPill: 12% alpha of text colour -----
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
