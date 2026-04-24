import { SITE } from "@/lib/constants";
import type { MetadataRoute } from "next";
import { fetchPackages } from "@/lib/data/packages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const packages = await fetchPackages();
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/packages`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/custom-trip`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/corporate-travel`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/group-travel`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/booking`, changeFrequency: "monthly", priority: 0.5 },
    ...packages.map((p) => ({
      url: `${base}/packages/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
