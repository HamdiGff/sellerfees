import type { MetadataRoute } from "next";
import { PAGES } from "@/lib/registry";
import { abs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), lastModified: PAGES.reduce((m, p) => (p.lastReviewed > m ? p.lastReviewed : m), "2026-01-01") },
    ...PAGES.filter((p) => p.status === "live").map((p) => ({ url: abs(p.path), lastModified: p.lastReviewed })),
  ];
}
