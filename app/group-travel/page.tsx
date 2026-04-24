import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Church, Tag, ListChecks, Shield } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { SectionFade } from "@/components/motion/section-fade";

export const metadata: Metadata = {
  title: "Group travel for schools, churches & organisations",
  description: "Manifests, chaperones, and tiered group savings for Nigerian schools and faith communities.",
};

const items = [
  { icon: ListChecks, title: "Group manifest", body: "Passenger names, chaperone ratios, and bus assignments — in one file." },
  { icon: GraduationCap, title: "Schools & students", body: "Educational day trips, regional exchanges, and safe corridor planning." },
  { icon: Church, title: "Church & community", body: "Pilgrimages, conventions, and multi-bus coordination with calm hosts." },
  { icon: Tag, title: "Group discounts", body: "Tiered savings that reward scale and early commitment." },
  { icon: Shield, title: "On-ground support", body: "Optional escorts, medical liaisons, and daily check-ins for leaders." },
] as const;

export default function GroupTravelPage() {
  return (
    <SiteShell>
      <div className="bg-surface">
        <div className="mx-auto min-w-0 max-w-5xl px-4 py-12 text-center sm:py-16 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Together, better</p>
          <h1 className="mt-3 text-balance font-serif text-2xl text-ink sm:text-3xl md:text-4xl">
            Group travel for schools, churches, and associations
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
            The same NMA Luxe service philosophy — scaled for rosters, vehicles, and faith-filled itineraries.
          </p>
        </div>
        <div className="mx-auto max-w-6xl space-y-4 px-4 pb-16 md:px-6">
          {items.map((it) => (
            <SectionFade key={it.title}>
              <div className="flex min-w-0 gap-4 rounded-2xl border border-border/80 p-5 md:items-center md:p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="font-serif text-xl text-ink">{it.title}</h2>
                  <p className="text-sm text-muted">{it.body}</p>
                </div>
              </div>
            </SectionFade>
          ))}
        </div>
        <div className="border-t border-border/80 bg-[#f6f2ea] py-12 text-center">
          <p className="text-sm text-muted">Ready to brief us?</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Button asChild className="rounded-full" variant="gold" size="lg">
              <Link href="/custom-trip">Start a custom group brief</Link>
            </Button>
            <Button asChild className="rounded-full" variant="outline" size="lg">
              <Link href="/packages">See package bases</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
