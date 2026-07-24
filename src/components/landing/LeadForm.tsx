"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type LeadState } from "@/app/actions/lead";
import { formatPhone } from "@/lib/phone";
import { Button } from "@/components/design-system/Button";
import { Icon } from "@/components/design-system/Icon";

const initial: LeadState = { ok: false, message: "" };

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

function SubmitButton({ canSubmit }: { canSubmit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth disabled={pending || !canSubmit}>
      {pending ? "신청 중…" : "무료 리포트 신청하기"}
    </Button>
  );
}

// 하단 신청 폼 (PRD L3) — 이름 + 휴대폰 인증(egress gateway SMS) 후 리드 저장.
export function LeadForm({
  selectedCode,
  selectedName,
}: {
  selectedCode?: string;
  selectedName?: string;
}) {
  const [state, formAction] = useActionState(submitLead, initial);
  const [tracking, setTracking] = useState<Tracking | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"idle" | "sent" | "verified">("idle");
  const [busy, setBusy] = useState(false);
  const [smsMsg, setSmsMsg] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  useEffect(() => {
    setTracking(readTracking());
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

  if (state.ok) {
    return (
      <section id="apply" className="scroll-mt-6 px-5">
        <div className="flex flex-col items-center gap-3 rounded-[16px] bg-kb-fill p-8 text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-[16px]"
            style={{ background: "rgba(15,190,108,0.12)" }}
          >
            <Icon name="check" size={28} color="var(--kb-positive)" />
          </div>
          <p className="text-base font-semibold">{state.message}</p>
        </div>
      </section>
    );
  }

  const verified = step === "verified";

  return (
    <section id="apply" className="scroll-mt-6 px-5">
      <div className="flex flex-col gap-4 rounded-[16px] bg-kb-fill p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">무료 리포트 신청</h2>
          <p className="text-sm text-kb-gray">
            {selectedName
              ? `${selectedName} 리포트를 오늘 저녁에 보내드릴게요.`
              : "관심 종목 리포트를 오늘 저녁에 보내드릴게요."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className={inputCls}
            aria-label="이름"
          />

          {/* 휴대폰 + 인증번호 받기 */}
          <div className="flex gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              inputMode="tel"
              placeholder="휴대폰 번호"
              className={inputCls}
              aria-label="휴대폰 번호"
              readOnly={verified}
            />
            <Button
              type="button"
              variant="outline"
              onClick={sendCode}
              disabled={busy || verified || name.trim().length < 1 || phone.length < 12}
              className="shrink-0 whitespace-nowrap"
            >
              {step === "idle" ? "인증번호 받기" : "재발송"}
            </Button>
          </div>

          {/* 인증번호 입력 + 확인 */}
          {step !== "idle" && (
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
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

        {/* 최종 제출 — 인증 완료 시에만 활성화 */}
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="phone" value={phone} />
          <input
            type="hidden"
            name="interest"
            value={selectedName ? `${selectedName}(${selectedCode ?? ""})` : ""}
          />
          <input type="hidden" name="traffic_source" value={tracking?.traffic_source ?? ""} />
          <input type="hidden" name="ad_keyword" value={tracking?.ad_keyword ?? ""} />
          <input type="hidden" name="ad_campaign_id" value={tracking?.ad_campaign_id ?? ""} />
          <input type="hidden" name="ad_campaign_label" value={tracking?.ad_campaign_label ?? ""} />
          <input type="hidden" name="landing_url" value={tracking?.landing_url ?? ""} />
          <input type="hidden" name="marketing_consent" value={agreeMarketing ? "1" : "0"} />

          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-2 text-xs leading-relaxed text-kb-gray">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-kb-black"
              />
              <span>
                <span className="font-semibold text-kb-black">[필수]</span> 개인정보 수집·이용에
                동의해요. (이름·휴대폰번호, 리포트 발송 목적)
              </span>
            </label>
            <label className="flex items-start gap-2 text-xs leading-relaxed text-kb-gray">
              <input
                type="checkbox"
                checked={agreeMarketing}
                onChange={(e) => setAgreeMarketing(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-kb-black"
              />
              <span>
                <span className="font-semibold text-kb-black">[선택]</span> 광고성 정보 수신에
                동의해요.
              </span>
            </label>
          </div>

          {state.message && !state.ok && (
            <p className="text-sm text-kb-critical">{state.message}</p>
          )}
          <SubmitButton canSubmit={verified && agreePrivacy} />
        </form>
      </div>
    </section>
  );
}
