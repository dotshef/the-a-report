import { NextResponse } from "next/server";
import { getReport } from "@/data/loader";

// 리포트 미리보기 데이터 — DB(price_daily/fundamental/news) + 임베딩 제목/분류.
// GET /api/report/005930
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const report = await getReport(code);
  if (!report) {
    return NextResponse.json({ error: "종목을 찾을 수 없어요" }, { status: 404 });
  }
  return NextResponse.json(report);
}
