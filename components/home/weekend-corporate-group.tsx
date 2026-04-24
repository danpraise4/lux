import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionFade } from "@/components/motion/section-fade";
import { MotionCard } from "@/components/motion/motion-card";
import { IMG } from "@/lib/site-images";

const weekends = [
  {
    title: "Highland mist & culture",
    city: "Jos",
    img: IMG.culture,
  },
  {
    title: "Seaside tables & light",
    city: "Lagos",
    img: IMG.seaSide,
  },
  {
    title: "Garden city calm",
    city: "Port Harcourt",
    img: IMG.portHarcourtBeach,
  },
] as const;

export function WeekendEscapes() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionFade>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Weekend escapes</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">Short breaks, full feeling</h2>
        </SectionFade>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {weekends.map((w) => (
            <MotionCard key={w.title}>
              <Card className="overflow-hidden border-border/60">
                <div className="relative h-48">
                  <Image src={w.img} alt={w.title} fill className="object-cover" />
                </div>
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">{w.city}</p>
                  <h3 className="font-serif text-xl">{w.title}</h3>
                  <Button asChild variant="link" className="px-0 text-gold">
                    <Link href="/packages?duration=1-2%20days">
                      View long weekends
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CorporateBlock() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Corporate travel</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Staff travel, invoices, and a dedicated desk.</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Flight holds, group-friendly hotels, and transparent billing for Nigerian teams. We align with your finance
            cadence and keep travellers informed.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/80">
            <li>— Staff &amp; executive movements</li>
            <li>— Consolidated group invoicing</li>
            <li>— On-trip adjustments &amp; support</li>
          </ul>
          <Button asChild className="mt-6 rounded-full" variant="gold" size="lg">
            <Link href="/corporate-travel">Request a proposal</Link>
          </Button>
        </div>
        <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 md:h-96">
          <Image
            src={IMG.landscapeHero}
            alt="Corporate travel"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-sm text-white/90">
            <Building2 className="h-5 w-5 text-gold" />
            <p className="mt-2 font-serif text-lg">Bespoke for boards, teams &amp; offsite strategists</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GroupTravelBlock() {
  return (
    <section className="bg-[#f6f2ea] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="relative h-64 overflow-hidden rounded-2xl border border-gold/20 shadow-card md:h-80">
            <Image
              src={IMG.coastal}
              alt="Group travel"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Groups we love</p>
            <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">Schools, churches, associations</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Chaperone-ready planning, group manifests, and discounts that reward scale. Perfect for education trips and
              faith community pilgrimages.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink/80">
              <li>— Manifests &amp; chaperone coordination</li>
              <li>— Tiered group savings</li>
              <li>— Safety-first route planning</li>
            </ul>
            <Button asChild className="mt-6 rounded-full" variant="gold" size="lg">
              <Link href="/group-travel">Explore group travel</Link>
            </Button>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink/70">
              <School className="h-4 w-4 text-gold" />
              Ask about multi-bus movements &amp; student pricing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
