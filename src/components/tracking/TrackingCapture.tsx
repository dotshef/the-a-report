"use client";

import { useEffect } from "react";
import { captureAdAttribution } from "@/lib/tracking";

// 최초 진입 시점의 광고 유입 정보를 세션에 고정한다.
// 폼이 없는 페이지로 광고가 떨어져도 값이 남도록 layout에 둔다 — 신청 폼은
// 나중에 어느 페이지에서 뜨든 여기서 보관한 값을 읽어 제출한다.
export function TrackingCapture() {
  useEffect(() => {
    captureAdAttribution();
  }, []);

  return null;
}
