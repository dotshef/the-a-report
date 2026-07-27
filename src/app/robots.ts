import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /request 는 종목 선택 후 진입하는 신청 폼 — 색인 대상 아님.
      { userAgent: "*", allow: "/", disallow: ["/api/", "/request"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
