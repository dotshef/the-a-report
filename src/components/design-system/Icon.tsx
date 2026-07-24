// KakaoBank-family pictograms — 24px / 2px stroke / rounded caps.
// Substituting Lucide-style geometry (per Design System README: real
// production work swaps in KakaoBank's bespoke icon assets).

export type IconName =
  | "search"
  | "send"
  | "chev"
  | "check"
  | "close"
  | "bell"
  | "sparkle"
  | "arrow-right"
  | "chart"
  | "lock"
  | "news"
  | "phone";

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "send":
      return (
        <svg {...props}>
          <path d="M22 2 11 13" />
          <path d="M22 2 15 22l-4-9-9-4z" />
        </svg>
      );
    case "chev":
      return (
        <svg {...props}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="M5 12l5 5L20 7" />
        </svg>
      );
    case "close":
      return (
        <svg {...props}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "bell":
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...props}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...props}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <path d="M4 20V4M4 20h16M8 16l3-4 3 2 4-6" />
        </svg>
      );
    case "lock":
      return (
        <svg {...props}>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "news":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M7 9h6M7 13h10M7 17h10" />
        </svg>
      );
    case "phone":
      return (
        <svg {...props}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l2 5v-1a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
