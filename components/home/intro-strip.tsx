import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionFade } from "@/components/motion/section-fade";
import { Plane } from "lucide-react";
import { IMG } from "@/lib/site-images";

export function IntroStrip() {
  return (
    <section className="relative z-0 mt-0 bg-surface pb-12 pt-10 md:pb-20 md:pt-14">
      <div className="bg-topo pointer-events-none absolute right-0 top-0 h-1/2 w-1/2" />
      <div className="relative mx-auto grid max-w-7xl min-w-0 items-center gap-10 px-4 md:grid-cols-2 md:px-6 lg:gap-16 lg:px-8">
        <SectionFade>
          <h2 className="font-serif text-2xl text-ink sm:text-3xl md:text-4xl">Welcome to NMA Luxe</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A Nigerian travel house crafting affordable luxury across domestic routes and handpicked West African
            stories. We handle flights, hotels, transfers, and the invisible details — so you arrive present, not
            preoccupied.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            From corporate account management to group manifests for schools and faith communities, we build calm,
            end-to-end journeys.
          </p>
          <Button asChild className="mt-6 rounded-full" variant="gold" size="lg">
            <Link href="/custom-trip">Plan with our team</Link>
          </Button>
        </SectionFade>
        <SectionFade delay={0.1}>
          <div className="relative min-w-0">
            <div className="relative h-[18rem] overflow-hidden rounded-2xl border border-gold/15 shadow-2xl sm:h-[22rem] md:h-[26rem]">
              <Image
                src={IMG.coastal}
                alt="Travelers"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative z-10 mx-auto mt-4 max-w-lg rounded-xl border border-gold/30 bg-ink/95 p-4 text-sm text-white shadow-2xl sm:mt-5 md:absolute md:bottom-0 md:right-0 md:mx-0 md:mt-0 md:max-w-xs md:translate-y-0 md:p-5">
              <div className="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-md bg-gold/20 text-gold">
                <Plane className="h-4 w-4" />
              </div>
              <p className="font-serif text-base sm:text-lg">Excellence in every experience.</p>
            </div>
          </div>
        </SectionFade>
      </div>
    </section>
  );
}
