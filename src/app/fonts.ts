import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    { path: "../../public/fonts/Pretendard-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Pretendard-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Pretendard-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Pretendard-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Pretendard-ExtraBold.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-pretendard",
  display: "swap",
});
