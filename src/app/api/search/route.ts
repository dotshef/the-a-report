import { NextRequest, NextResponse } from "next/server";
import { searchStocks } from "@/data/loader";

// 종목 검색 — stock(ST) 이름/코드 매칭. 요청 경로는 DB만 읽음.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/search?q=삼성
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchStocks(q, 8);
  return NextResponse.json({ results });
}
