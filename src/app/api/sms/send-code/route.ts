import { NextResponse } from "next/server";
import { sendSms } from "@/lib/sms/gateway";
import { CODE_TTL_MS, generateCode } from "@/lib/sms/verification";
import { checkSendRateLimit, createVerification } from "@/lib/sms/verificationStore";
import { isBlockedUserAgent } from "@/lib/sms/blockedUserAgents";
import { normalizePhone } from "@/lib/phone";
import { hasRecentDuplicateReportRequest } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// POST /api/sms/send-code  { name, phone } → egress gateway로 인증번호 발송
export async function POST(req: Request) {
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  let body: { name?: unknown; phone?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = normalize(body.name);
  const phone = normalizePhone(normalize(body.phone));
  if (!name) return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "올바른 연락처를 입력해주세요." }, { status: 400 });

  // SMS 펌핑 공격 UA 차단 — 발송 비용이 발생하는 모든 처리보다 앞에 둔다
  if (isBlockedUserAgent(userAgent)) {
    // UA 원문을 반드시 남긴다 — 다음 로테이션을 추적하는 유일한 단서
    console.warn(`[sms/send-code] ua-blocked | ip=${ip} | phone=${phone} | ua=${userAgent}`);
    return NextResponse.json(
      { error: "보안 정책에 따라 차단되었습니다. 다른 브라우저로 시도해주세요." },
      { status: 403 },
    );
  }

  // 중복 접수 차단 — 이름+연락처 완전일치 + 최근 접수 이력 (선제 차단으로 불필요한 발송 비용 절감)
  try {
    if (await hasRecentDuplicateReportRequest(name, phone)) {
      return NextResponse.json(
        { error: "이미 접수된 이력이 있습니다." },
        { status: 409 },
      );
    }
  } catch (error) {
    console.error("[sms/send-code] duplicate check failed:", error);
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요." }, { status: 500 });
  }

  // 발송 남용 차단 (쿨다운 / 시간당 한도)
  let gate;
  try {
    gate = await checkSendRateLimit(phone);
  } catch (error) {
    console.error("[sms/send-code] rate-limit lookup failed:", error);
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요." }, { status: 500 });
  }
  if (!gate.ok) {
    const message =
      gate.reason === "cooldown"
        ? `${gate.retryAfterSec}초 후에 다시 시도해주세요.`
        : "인증번호 발송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
    return NextResponse.json(
      { error: message },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const code = generateCode();
  console.log(`[sms/send-code] sending to ${phone} | ip=${ip} | ua=${userAgent}`);

  try {
    const result = await sendSms({
      receiver: phone,
      msg: `[인증번호] ${code}\n인증번호 6자리를 입력해주세요.`,
      msgType: "SMS",
    });
    if (!result.ok) {
      console.error("[sms/send-code] Gateway failed:", result.resultCode, result.message);
      return NextResponse.json(
        { error: "인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[sms/send-code] send error:", error);
    return NextResponse.json(
      { error: "인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }

  // 발송 성공 후에만 인증행 저장
  try {
    await createVerification(phone, code, name);
  } catch (error) {
    console.error("[sms/send-code] DB insert failed:", error);
    return NextResponse.json(
      { error: "인증번호 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, ttlMs: CODE_TTL_MS });
}
