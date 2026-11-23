import type { MetadataRoute } from "next"
import { NICHES } from "@/lib/niches"
import { SITE } from "@/lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/portfolio", ...NICHES.map((n) => `/${n.slug}`), "/mentions-legales", "/confidentialite"]
  return pages.map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/portfolio" ? 0.9 : p.startsWith("/m") || p.startsWith("/c") ? 0.3 : 0.8,
  }))
}
