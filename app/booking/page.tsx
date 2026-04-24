import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { fetchPackages } from "@/lib/data/packages";

export const metadata: Metadata = {
  title: "Book a package",
  description: "Multi-step secure booking for N. M. A Luxe Travel & Tour Company.",
  robots: { index: false, follow: false },
};

export default async function BookingPage() {
  const packages = await fetchPackages();
  return (
    <SiteShell>
      <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-border/30" />}>
        <BookingWizard packages={packages} />
      </Suspense>
    </SiteShell>
  );
}
