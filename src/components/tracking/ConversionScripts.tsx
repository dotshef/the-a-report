"use client";

import { useEffect } from "react";
import { sendNaverConversion } from "@/lib/naver-wcs";

// 광고 매체 전환 태그 삽입 지점 (완료 페이지 전용).
//
// layout.tsx의 공통 추적 스크립트(에이스카운터 등)는 완료 페이지로 하드 내비게이션할 때
// 문서가 새로 로드되며 /request/complete URL로 1회 발화한다. 따라서 URL 기반 전환은
// 여기에 아무것도 추가하지 않아도 잡힌다.
//
// 네이버는 URL이 아니라 전용 API(wcs.trans)로 전환을 받으므로 여기서 발화시킨다.
// wcslog.js 로드와 PV(wcs_do)는 layout의 NaverTracking이 담당하고, sendNaverConversion이
// PV 완료까지 기다렸다 호출한다 — 가이드가 요구하는 "PV 먼저, 전환 나중" 순서.
//
// gtag conversion·메타 픽셀 Lead 등 다른 매체 태그도 아래 useEffect에 추가한다.
const ONCE_KEY = "lead_conversion_fired";

export function ConversionScripts() {
  useEffect(() => {
    // 같은 세션에서 중복 발화 방지 (통과권 쿠키는 middleware가 이미 1회로 제한한다).
    let alreadyFired = false;
    try {
      alreadyFired = Boolean(sessionStorage.getItem(ONCE_KEY));
      sessionStorage.setItem(ONCE_KEY, "1");
    } catch {
      // sessionStorage가 막힌 환경(시크릿 모드 등). 통과권 쿠키가 이미 1회용이므로
      // 중복 위험을 감수하기보다 전환을 놓치지 않는 쪽을 택한다.
    }
    if (alreadyFired) return;

    return sendNaverConversion("lead");
  }, []);

  return null;
}
