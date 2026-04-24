import { Check } from "lucide-react";
import { SectionFade } from "@/components/motion/section-fade";

const points = [
  {
    title: "Trusted team",
    body: "Seasoned planners across Jos, Lagos, Port Harcourt & Owerri — one calm point of contact.",
  },
  {
    title: "Personalized planning",
    body: "Itineraries tuned to your pace, dietary needs, and reason for travel — not generic PDFs.",
  },
  {
    title: "Affordable luxury",
    body: "Hotel & transport purchasing power that keeps premium within reach for groups and couples.",
  },
  {
    title: "Smooth logistics",
    body: "Airport transfers, manifests, and on-ground hosts when you need hands-on support.",
  },
  {
    title: "Premium support",
    body: "WhatsApp-first service, clear payment milestones, and proactive day-of coordination.",
  },
] as const;

export function WhyChoose() {
  return (
    <section className="relative border-y border-dashed border-border/80 bg-[#fcfbfa] py-20 md:py-28">
      <div className="bg-topo pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionFade>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Why book with us</p>
          <h2 className="mt-3 max-w-3xl font-serif text-2xl text-ink sm:text-3xl md:text-4xl">
            NMA Luxe — your partner for Nigeria &amp; West Africa, without the noise.
          </h2>
          <div className="mt-6 h-px w-16 bg-gold/50" />
        </SectionFade>

        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {points.map((p, i) => (
            <SectionFade key={p.title} delay={i * 0.05}>
              <div className="flex min-w-0 gap-3">
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-xl text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </div>
            </SectionFade>
          ))}
        </div>
      </div>
    </section>
  );
}
