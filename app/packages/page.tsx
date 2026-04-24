import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { PackagesView } from "@/components/packages/packages-view";
import { fetchPackages } from "@/lib/data/packages";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Luxury tour packages in Nigeria & West Africa",
  description: `Handpicked domestic and regional packages with transparent pricing. ${SITE.shortName} — based in Nigeria.`,
  openGraph: { title: "Tour packages", description: "Filter by city, budget, and travel style." },
};

export default async function PackagesPage() {
  const packages = await fetchPackages();
  return (
    <SiteShell>
      <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-border/30" />}>
        <PackagesView initial={packages} />
      </Suspense>
    </SiteShell>
  );
}
