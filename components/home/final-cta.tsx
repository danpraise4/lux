import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionFade } from "@/components/motion/section-fade";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-y border-gold/20 bg-ink text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,134,11,0.2),transparent_50%)]" />
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
        <SectionFade>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Start here</p>
          <h2 className="mt-3 text-balance font-serif text-2xl sm:text-3xl md:text-4xl">
            Build a trip that feels like yours — not a template.
          </h2>
          <p className="mt-3 text-sm text-white/80">
            Tell us the mood, the people, the dates. We respond with a refined plan and clear pricing milestones.
          </p>
          <div className="mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Button asChild size="lg" className="w-full rounded-full sm:w-auto" variant="gold">
              <Link href="/custom-trip">Plan a custom trip</Link>
            </Button>
            <Button asChild size="lg" className="w-full rounded-full border border-white/30 sm:w-auto" variant="hero">
              <Link href="/packages">Browse packages</Link>
            </Button>
          </div>
        </SectionFade>
      </div>
    </section>
  );
}
