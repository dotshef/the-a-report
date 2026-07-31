import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DoneMessage } from "@/components/landing/DoneMessage";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { ConversionScripts } from "@/components/tracking/ConversionScripts";
import { LEAD_DONE_MESSAGE, readLeadCompleteCookie } from "@/lib/lead-complete";

// 리포트 신청 완료 페이지 — 광고 매체 전환 URL(정확일치 /request/complete).
// 쿠키를 읽으므로 항상 동적 렌더.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "신청 완료",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default async function RequestCompletePage() {
  const done = await readLeadCompleteCookie();
  // 통과권이 없으면 정상 접수 경로가 아니다 — 추적 스크립트가 실행될 기회를 주지 않는다.
  if (!done) redirect("/");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-8 pb-16">
      <section className="flex flex-col gap-4 px-5 pt-10">
        <DoneMessage message={LEAD_DONE_MESSAGE} />

        {done.interest && (
          <div className="flex items-center gap-2 rounded-[12px] border border-kb-border bg-kb-white p-3 text-sm">
            <span className="text-kb-gray">신청 리포트</span>
            <span className="font-bold">{done.interest}</span>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-[12px] border border-kb-light-gray text-base font-semibold text-kb-black transition-colors duration-150 hover:bg-kb-fill"
        >
          다른 종목 리포트 보러가기
        </Link>
      </section>

      <SiteFooter />
      <ConversionScripts />
    </main>
  );
}
