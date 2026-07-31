"use client";

import { useEffect } from "react";

// 광고 매체 전환 태그 삽입 지점 (완료 페이지 전용).
//
// layout.tsx의 공통 추적 스크립트(에이스카운터 등)는 완료 페이지로 하드 내비게이션할 때
// 문서가 새로 로드되며 /request/complete URL로 1회 발화한다. 따라서 URL 기반 전환은
// 여기에 아무것도 추가하지 않아도 잡힌다.
//
// 매체가 별도 전환 태그를 요구하는 경우(네이버 전환 스크립트, gtag conversion,
// 메타 픽셀 Lead 이벤트 등)에만 아래 useEffect 안에 추가한다.
const ONCE_KEY = "lead_conversion_fired";

export function ConversionScripts() {
  useEffect(() => {
    // 같은 세션에서 중복 발화 방지 (통과권 쿠키는 middleware가 이미 1회로 제한한다).
    if (sessionStorage.getItem(ONCE_KEY)) return;
    sessionStorage.setItem(ONCE_KEY, "1");

    // 예) window.gtag?.("event", "conversion", { send_to: "AW-XXXXXXXX/YYYY" });
  }, []);

  return null;
}
