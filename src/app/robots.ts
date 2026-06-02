import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

/** Paths that should not be indexed (app, auth, APIs). */
const DISALLOW = ["/admin/", "/dashboard/", "/login", "/api/"];

const CRAWLER_ALLOW = {
  allow: "/",
  disallow: DISALLOW,
} as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "OAI-SearchBot", ...CRAWLER_ALLOW },
      { userAgent: "ChatGPT-User", ...CRAWLER_ALLOW },
      { userAgent: "GPTBot", ...CRAWLER_ALLOW },
      { userAgent: "*", ...CRAWLER_ALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
