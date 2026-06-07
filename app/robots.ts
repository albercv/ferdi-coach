import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-config"

const DISALLOW = ["/api/", "/admin/", "/_next/", "/private/", "/dashboard", "/login"]
const AI_BOTS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: "Googlebot", allow: "/", disallow: DISALLOW },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
