import type { Metadata, Viewport } from "next";
import { pretendard } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘의 종목 리포트 — 매일 무료로 받아보세요",
  description:
    "코스피·코스닥 2,651개 종목의 주가와 AI 리포트를 검색하고, 매일 무료 리포트를 신청하세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFE300",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
