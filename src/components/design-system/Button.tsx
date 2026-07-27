import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "critical";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[12px] px-5 min-h-12 " +
  "text-base font-semibold transition-[opacity,background-color] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] " +
  "active:opacity-85 disabled:opacity-100 disabled:cursor-default cursor-pointer select-none";

// 포인트 컬러는 product, not chrome. 필드그린(#2E6B43)은 어두운 면이라 위에 올리는
// 텍스트는 ALWAYS 화이트 (기존 옐로우 규칙 #1E1E1E는 대비가 안 나와 폐기).
const variants: Record<Variant, string> = {
  primary: "bg-brand text-kb-white hover:bg-brand-dark",
  secondary: "bg-kb-black text-kb-white",
  outline: "bg-transparent text-kb-black border border-kb-light-gray",
  critical: "bg-kb-critical text-kb-white",
};

const disabledCls = "!bg-kb-fill !text-kb-light-gray !border-transparent";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", fullWidth, className = "", disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={[
        base,
        disabled ? disabledCls : variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
});
