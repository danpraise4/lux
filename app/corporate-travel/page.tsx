import type { Metadata } from "next";
import { Building2, FileSpreadsheet, Headphones, Plane } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { CorporateForm } from "@/components/corporate/corporate-form";
import { SectionFade } from "@/components/motion/section-fade";

export const metadata: Metadata = {
  title: "Corporate travel management",
  description: "Staff travel, group invoices, and dedicated NMA Luxe support for Nigerian organisations.",
};

const blocks = [
  { icon: Plane, title: "Staff & leadership travel", body: "Policy-aligned routings, fare holds, and upgrade paths where budget allows." },
  { icon: FileSpreadsheet, title: "Group invoices", body: "One statement for departments — reduce finance back-and-forth." },
  { icon: Building2, title: "Hotels & flights in sync", body: "Block rooms, airport timing, and last-minute rebooks through one desk." },
  { icon: Headphones, title: "Dedicated support", body: "Named point of contact for your travel calendar and on-trip escalations." },
] as const;

export default function CorporateTravelPage() {
  return (
    <SiteShell>
      <div className="bg-surface">
        <div className="border-b border-border/80 bg-ink text-white">
          <div className="mx-auto min-w-0 max-w-6xl px-4 py-12 sm:py-16 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">For organisations</p>
            <h1 className="mt-3 max-w-2xl text-balance font-serif text-2xl sm:text-3xl md:text-4xl">
              Corporate travel that stays elegant — and under control
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/80">
              From board retreats in Jos to project shuttles in PH: we build clarity into every itinerary and invoice.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2 md:px-6">
          {blocks.map((b) => (
            <SectionFade key={b.title}>
              <div className="rounded-2xl border border-border/80 bg-[#f9f7f2] p-6">
                <b.icon className="h-6 w-6 text-gold" />
                <h2 className="mt-3 font-serif text-xl text-ink">{b.title}</h2>
                <p className="mt-2 text-sm text-muted">{b.body}</p>
              </div>
            </SectionFade>
          ))}
        </div>
        <div className="mx-auto max-w-3xl border-t border-border/80 px-4 py-16 md:px-6">
          <h2 className="font-serif text-2xl">Request a formal proposal</h2>
          <p className="mt-2 text-sm text-muted">We review within one business day. NDAs on request.</p>
          <div className="mt-8">
            <CorporateForm />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
