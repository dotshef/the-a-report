"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { sendNaverPageView, WCSLOG_SRC } from "@/lib/naver-wcs";

// 네이버 전환추적 공통 + PV 스크립트 (모든 페이지).
// wcslog.js는 한 페이지에 1회만 로드해야 하므로 layout에서만 렌더한다.
export function NaverTracking() {
  const pathname = usePathname();

  // 소프트 내비게이션(Link·router.push)은 문서를 새로 로드하지 않아 PV가 다시 나가지
  // 않는다. 경로가 바뀔 때마다 직접 발화시켜 전 페이지 설치와 같은 상태로 만든다.
  useEffect(() => sendNaverPageView(), [pathname]);

  return <Script id="naver-wcslog" src={WCSLOG_SRC} strategy="afterInteractive" />;
}
