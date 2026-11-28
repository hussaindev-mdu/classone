export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { allServices } from "@/lib/content";
import { IS_STATIC_EXPORT } from "@/lib/base-path";

export default function sitemap(): MetadataRoute.Sitemap {
  const slash = IS_STATIC_EXPORT ? "/" : "";
  const url = (path: string) => `${siteConfig.url}${path}${path === "" ? "/" : slash}`;
  const now = new Date();
  return [
    { url: url(""), lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...["/services", "/about", "/process", "/careers", "/contact"].map((p) => ({
      url: url(p),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...allServices.map((s) => ({
      url: url(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
