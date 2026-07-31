"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { submitLead, type LeadState } from "@/app/actions/lead";
import { formatPhone } from "@/lib/phone";
import { Button } from "@/components/design-system/Button";
import { Icon } from "@/components/design-system/Icon";
import { Modal } from "@/components/design-system/Modal";
import { DoneMessage } from "./DoneMessage";

const initial: LeadState = { ok: false, message: "" };

// 동의 약관 상세 — "보기" 버튼으로 모달에 노출.
function PrivacyConsentDetail() {
  return (
    <div className="flex flex-col gap-3">
      <p>
        에이주식연구소은 무료 리포트 제공을 위해 아래와 같이 개인정보를 수집 및
        이용합니다.
      </p>
      <ul className="flex flex-col gap-1">
        <li>· 수집 항목: 이름, 연락처, 관심 분야, 유입 광고 매체, 광고 키워드</li>
        <li>
          · 이용 목적: 무료 리포트 제공, 투자 정보 안내, 광고 유입경로 및 광고
          성과 확인
        </li>
        <li>· 보유 기간: 동의일로부터 1년</li>
      </ul>
    </div>
  );
}

function MarketingConsentDetail() {
  return (
    <div className="flex flex-col gap-3">
      <p>
        회사는 무료 리포트, 투자정보, 시장 브리핑, 이벤트 및 신규 서비스 안내를
        위해 아래와 같이 마케팅 정보를 제공합니다.
      </p>
      <div className="flex flex-col gap-1">
        <p className="font-semibold">1. 수신 항목</p>
        <ul className="flex flex-col gap-1">
          <li>· 문자(SMS/LMS)</li>
          <li>· 전화</li>
          <li>· 카카오톡</li>
        </ul>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold">2. 이용 목적</p>
        <ul className="flex flex-col gap-1">
          <li>· 무료 리포트 제공</li>
          <li>· 투자 관련 정보 및 시장 브리핑 안내</li>
          <li>· 이벤트 및 프로모션 안내</li>
          <li>· 신규 서비스 및 콘텐츠 안내</li>
        </ul>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold">3. 보유 및 이용 기간</p>
        <p>동의 철회 시까지</p>
      </div>
    </div>
  );
}

interface Tracking {
  traffic_source: string;
  ad_keyword: string;
  ad_campaign_id: string;
  ad_campaign_label: string;
  landing_url: string;
}

// 유입/광고 파라미터를 URL·referrer에서 수집 (report_request 트래킹 컬럼).
function readTracking(): Tracking {
  const p = new URLSearchParams(window.location.search);
  let source = p.get("utm_source") ?? "";
  if (!source && document.referrer) {
    try {
      source = new global.URL(document.referrer).hostname;
    } catch {
      source = "";
    }
  }
  return {
    traffic_source: source || "unknown",
    ad_keyword: p.get("utm_term") ?? p.get("keyword") ?? "",
    ad_campaign_id: p.get("utm_campaign") ?? p.get("campaign_id") ?? "",
    ad_campaign_label: p.get("utm_content") ?? p.get("campaign") ?? "",
    landing_url: window.location.href,
  };
}

const inputCls =
  "min-h-12 w-full rounded-[12px] border border-kb-light-gray bg-white px-4 text-base outline-none focus:border-[1.5px] focus:border-kb-black";

// redirecting: 접수는 끝났고 완료 페이지 로딩만 남은 구간.
// useFormStatus의 pending은 액션이 끝나는 즉시 false가 되므로, 이 구간까지
// 버튼을 눌린 상태로 잡아두지 않으면 완료 화면이 깜빡이거나 재제출이 가능해진다.
function SubmitButton({
  canSubmit,
  redirecting,
}: {
  canSubmit: boolean;
  redirecting: boolean;
}) {
  const { pending } = useFormStatus();
  const busy = pending || redirecting;
  return (
    <Button type="submit" fullWidth disabled={busy || !canSubmit}>
      {busy ? "신청 중…" : "지금 무료로 리포트 받기 →"}
    </Button>
  );
}

// 제출 버튼 아래 안내 — 무엇을 받는지 + 유선 안내를 명시한다.
function SubmitNote() {
  return (
    <p className="flex items-start justify-center gap-1.5 rounded-[10px] border border-brand-border bg-brand-surface px-3 py-2.5 text-center text-xs leading-relaxed font-semibold text-brand-muted">
      <Icon
        name="lock"
        size={14}
        color="var(--brand-strong)"
        className="mt-0.5 shrink-0"
      />
      <span>
        <b className="font-bold text-brand-strong">
          상승 근거 · 대응 시나리오 · 리스크 체크
        </b>
        까지 — 신청하면 담당자가 유선으로 안내해 드립니다
      </span>
    </p>
  );
}

// 헤더 위치 뒤로가기 — 종목 재선택을 위해 루트로 복귀.
// 배경을 따로 깔지 않고 페이지 그라데이션 위에 그대로 얹는다
// (배경이 없으므로 sticky도 두지 않는다 — 스크롤 시 본문과 겹친다).
function BackHeader() {
  return (
    <header className="flex items-center px-5 pt-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors duration-150 hover:text-brand-dark"
      >
        ← 종목 다시 선택
      </Link>
    </header>
  );
}

// 이름 + 휴대폰 인증(egress gateway SMS) 후 리드 저장.
// embedded=true 이면 랜딩 ① 섹션 카드 안에 필드만 렌더한다(헤더·카드·제목 없음).
export function LeadForm({
  selectedCode,
  selectedName,
  embedded = false,
}: {
  selectedCode?: string;
  selectedName?: string;
  embedded?: boolean;
}) {
  const [state, formAction] = useActionState(submitLead, initial);
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"idle" | "sent" | "verified">("idle");
  const [busy, setBusy] = useState(false);
  const [smsMsg, setSmsMsg] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [agreeMarketing, setAgreeMarketing] = useState(true);
  const [openModal, setOpenModal] = useState<null | "privacy" | "marketing">(
    null,
  );

  const [navBlocked, setNavBlocked] = useState(false);

  // 접수 성공 → 완료 페이지로 하드 내비게이션.
  // router.push(soft navigation)는 문서를 새로 로드하지 않아 layout의 광고 추적
  // 스크립트가 재실행되지 않는다 — 완료 URL 페이지뷰가 매체에 잡히지 않으므로
  // location.replace로 전체 로드시킨다(replace: 뒤로가기 시 폼 재제출 방지).
  useEffect(() => {
    if (!state.ok || !state.redirectTo) return;
    window.location.replace(state.redirectTo);

    // 이동이 끝내 일어나지 않는 환경(구형 인앱 웹뷰 등)에서 폼이 멈춘 것처럼
    // 보이지 않도록, 일정 시간 뒤에만 인라인 완료 안내로 폴백한다.
    const timer = setTimeout(() => setNavBlocked(true), 5000);
    return () => clearTimeout(timer);
  }, [state]);

  // 이동 대기 중에는 완료 화면을 미리 보여주지 않는다 — 문서가 교체되기 전
  // 잠깐 노출되면 완료 화면이 두 번 스쳐 지나가는 것처럼 보인다.
  const redirecting = state.ok && Boolean(state.redirectTo) && !navBlocked;

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const tracking = readTracking();
    for (const name of Object.keys(tracking) as (keyof Tracking)[]) {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.value = tracking[name];
    }
  }, []);

  async function sendCode() {
    setBusy(true);
    setSmsMsg("");
    try {
      const res = await fetch("/api/sms/send-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setStep("sent");
        setSmsMsg("인증번호를 문자로 보냈어요. 3분 안에 입력해 주세요.");
      } else {
        setSmsMsg(json.error ?? "인증번호 발송에 실패했어요.");
      }
    } catch {
      setSmsMsg("인증번호 발송에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    setBusy(true);
    setSmsMsg("");
    try {
      const res = await fetch("/api/sms/verify-code", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setStep("verified");
        setSmsMsg("");
      } else {
        setSmsMsg(json.error ?? "인증에 실패했어요.");
      }
    } catch {
      setSmsMsg("인증에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  // 폴백 전용 화면 — 완료 페이지 이동이 막힌 경우에만 도달한다.
  if (state.ok && !redirecting) {
    if (embedded) return <DoneMessage message={state.message} />;
    return (
      <>
        <BackHeader />
        <section id="apply" className="scroll-mt-6 px-5">
          <DoneMessage message={state.message} />
        </section>
      </>
    );
  }

  const verified = step === "verified";

  const fields = (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-name" className="text-sm font-semibold">
            이름
          </label>
          <input
            id="lead-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-phone" className="text-sm font-semibold">
            전화번호
          </label>
          <div className="flex gap-2">
            <input
              id="lead-phone"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputMode="tel"
              placeholder="010-1234-5678"
              className={inputCls}
              readOnly={verified}
            />
            <Button
              type="button"
              variant="outline"
              onClick={sendCode}
              disabled={
                busy ||
                verified ||
                name.trim().length < 1 ||
                phone.length < 12
              }
              className="shrink-0 whitespace-nowrap"
            >
              {step === "idle" ? "인증번호 받기" : "재발송"}
            </Button>
          </div>
        </div>

        {step !== "idle" && (
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              placeholder="인증번호 6자리"
              className={inputCls}
              aria-label="인증번호"
              readOnly={verified}
            />
            <Button
              type="button"
              onClick={verifyCode}
              disabled={busy || verified || code.length !== 6}
              className="shrink-0 whitespace-nowrap"
            >
              {verified ? "인증완료" : "확인"}
            </Button>
          </div>
        )}

        {verified && (
          <p className="flex items-center gap-1 text-sm font-semibold text-kb-positive">
            <Icon name="check" size={16} color="var(--kb-positive)" />
            휴대폰 인증이 완료됐어요
          </p>
        )}
        {smsMsg && <p className="text-sm text-kb-critical">{smsMsg}</p>}
      </div>

      <form ref={formRef} action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="phone" value={phone} />
        <input
          type="hidden"
          name="interest"
          value={
            selectedName ? `${selectedName}(${selectedCode ?? ""})` : ""
          }
        />
        <input
          type="hidden"
          name="traffic_source"
          defaultValue=""
        />
        <input
          type="hidden"
          name="ad_keyword"
          defaultValue=""
        />
        <input
          type="hidden"
          name="ad_campaign_id"
          defaultValue=""
        />
        <input
          type="hidden"
          name="ad_campaign_label"
          defaultValue=""
        />
        <input
          type="hidden"
          name="landing_url"
          defaultValue=""
        />
        <input
          type="hidden"
          name="marketing_consent"
          value={agreeMarketing ? "1" : "0"}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <label className="flex flex-1 cursor-pointer items-start gap-2 text-xs leading-relaxed text-kb-gray">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-kb-black"
              />
              <span>
                <span className="font-semibold text-kb-black">[필수]</span>{" "}
                개인정보 수집·이용에 동의해요.
              </span>
            </label>
            <button
              type="button"
              onClick={() => setOpenModal("privacy")}
              className="relative z-10 -mt-0.5 shrink-0 cursor-pointer rounded-[8px] px-2 py-1 text-xs text-kb-gray underline underline-offset-2 transition-colors hover:bg-kb-fill hover:text-kb-black"
            >
              보기
            </button>
          </div>
          <div className="flex items-start gap-2">
            <label className="flex flex-1 cursor-pointer items-start gap-2 text-xs leading-relaxed text-kb-gray">
              <input
                type="checkbox"
                checked={agreeMarketing}
                onChange={(e) => setAgreeMarketing(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-kb-black"
              />
              <span>
                <span className="font-semibold text-kb-black">[선택]</span>{" "}
                광고성 정보 수신에 동의해요.
              </span>
            </label>
            <button
              type="button"
              onClick={() => setOpenModal("marketing")}
              className="relative z-10 -mt-0.5 shrink-0 cursor-pointer rounded-[8px] px-2 py-1 text-xs text-kb-gray underline underline-offset-2 transition-colors hover:bg-kb-fill hover:text-kb-black"
            >
              보기
            </button>
          </div>
        </div>

        {state.message && !state.ok && (
          <p className="text-sm text-kb-critical">{state.message}</p>
        )}
        <SubmitButton
          canSubmit={verified && agreePrivacy}
          redirecting={redirecting}
        />
        <SubmitNote />
      </form>
    </>
  );

  const modals = (
    <>
      <Modal
        open={openModal === "privacy"}
        onClose={() => setOpenModal(null)}
        title="개인정보 수집·이용 동의"
      >
        <PrivacyConsentDetail />
      </Modal>
      <Modal
        open={openModal === "marketing"}
        onClose={() => setOpenModal(null)}
        title="광고성 정보 수신 동의"
      >
        <MarketingConsentDetail />
      </Modal>
    </>
  );

  if (embedded) {
    return (
      <>
        {fields}
        {modals}
      </>
    );
  }

  return (
    <>
      <BackHeader />
      <section id="apply" className="scroll-mt-6 px-5">
        <div className="flex flex-col gap-4 rounded-[16px] border border-kb-border bg-kb-white p-6">
          <h2 className="text-xl font-bold leading-snug">
            리포트를 받으실{" "}
            <span className="bg-[linear-gradient(to_top,var(--brand-surface)_0,var(--brand-surface)_34%,transparent_34%)] px-0.5">
              정보를 입력
            </span>
            하세요
          </h2>

          {selectedName && (
            <div className="flex items-center gap-3 rounded-[12px] border border-kb-border bg-kb-white p-3">
              <div className="flex flex-col">
                <span className="text-base font-bold">{selectedName}</span>
                <span className="text-xs text-kb-gray">
                  {selectedCode ? `${selectedCode} · ` : ""}분석 리포트
                </span>
              </div>
              <Link
                href="/"
                className="ml-auto text-xs text-kb-gray underline underline-offset-2"
              >
                변경
              </Link>
            </div>
          )}

          {fields}
        </div>
      </section>
      {modals}
    </>
  );
}
