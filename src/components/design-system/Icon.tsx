import {
  ArrowRight,
  Bell,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  Circle,
  Flame,
  LockKeyhole,
  Newspaper,
  Phone,
  Search,
  Send,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";

export type IconName =
  | "search"
  | "send"
  | "chev"
  | "check"
  | "close"
  | "bell"
  | "sparkle"
  | "flame"
  | "arrow-right"
  | "chart"
  | "lock"
  | "news"
  | "phone";

const icons: Record<IconName, LucideIcon> = {
  search: Search,
  send: Send,
  chev: ChevronRight,
  check: Check,
  close: X,
  bell: Bell,
  sparkle: Sparkles,
  flame: Flame,
  "arrow-right": ArrowRight,
  chart: ChartNoAxesCombined,
  lock: LockKeyhole,
  news: Newspaper,
  phone: Phone,
};

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const LucideIcon = icons[name] ?? Circle;

  return (
    <LucideIcon
      aria-hidden="true"
      className={className}
      color={color}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}
