import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { pretendard } from "./fonts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const title = "오늘의 종목 리포트 — 매일 무료로 받아보세요";
const description =
  "코스피·코스닥 2,651개 종목의 주가와 AI 리포트를 검색하고, 매일 무료 리포트를 신청하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${SITE_NAME}` },
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "ko_KR",
    title,
    description,
  },
  twitter: { card: "summary", title, description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2E6B43",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Analytics />
        {/* AceCounter Gathering Script V.9.0.2025011001 */}
        <Script id="acecounter" strategy="afterInteractive">{`
	var _AceGID=(function(){var Inf=['theareport.com','www.theareport.com,theareport.com','AZ3A106053','1','NaPm,Ncisy','1']; var _CI=(!_AceGID)?[]:_AceGID.val;var _N=0;if(_CI.join('.').indexOf(Inf[2])<0){ _CI.push(Inf);  _N=_CI.length; } return {o: _N,val:_CI}; })();
	var _AceCounter=(function(){var G=_AceGID;var _sc=document.createElement('script');var _sm=document.getElementsByTagName('script')[0];if(G.o!=0){var _A=G.val[G.o-1];var _U=(_A[4]).replace(/\\,/g,'_');_sc.src='https:/'+'/cr.acecounter.com/ac.j'+'s?gc='+_A[2]+'&py='+_A[1]+'&up='+_U+'&rd='+(new Date().getTime());_sm.parentNode.insertBefore(_sc,_sm);return _sc.src;}})();
        `}</Script>
      </body>
    </html>
  );
}
