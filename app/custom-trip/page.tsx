import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { CustomTripForm } from "@/components/custom-trip/custom-trip-form";
import { SectionFade } from "@/components/motion/section-fade";

export const metadata: Metadata = {
  title: "Plan a custom luxury trip",
  description: "Private itinerary design for domestic and West African travel — N. M. A Luxe.",
};

export default function CustomTripPage() {
  return (
    <SiteShell>
      <div className="bg-topo/30">
        <div className="mx-auto min-w-0 max-w-3xl px-4 py-12 sm:py-16 md:px-6 lg:py-24">
          <SectionFade>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Bespoke</p>
            <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Custom trip planner</h1>
            <p className="mt-3 text-sm text-muted">
              Share your dates, people, and the feeling you want. We&apos;ll return a refined, itemised proposal — with
              clear deposit and balance planning.
            </p>
          </SectionFade>
          <div className="mt-10">
            <CustomTripForm />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
