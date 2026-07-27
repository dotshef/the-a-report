import type { Metadata } from "next";
import { LeadForm } from "@/components/landing/LeadForm";
import { SiteFooter } from "@/components/landing/SiteFooter";

// 리포트 신청 폼 전용 하위 페이지 (루트에서 종목 선택 후 진입).
export const dynamic = "force-dynamic";

// 종목 쿼리별 중복 URL이 생기므로 색인에서 제외하고 canonical은 루트로 모은다.
export const metadata: Metadata = {
  title: "무료 리포트 신청",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; name?: string }>;
}) {
  const { code, name } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col gap-8 bg-white pb-16 shadow-[0_0_60px_rgba(0,0,0,0.06)]">
      <LeadForm selectedCode={code} selectedName={name} />
      <SiteFooter />
    </main>
  );
}
