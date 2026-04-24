"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionCard } from "@/components/motion/motion-card";
import { SectionFade } from "@/components/motion/section-fade";
import { SITE } from "@/lib/constants";
import { IMG } from "@/lib/site-images";

const items = [
  { name: "Jos", img: IMG.jos, large: true },
  { name: "Lagos", img: IMG.landscapeWide, large: true },
  { name: "Port Harcourt", img: IMG.portHarcourtBeach, large: false },
  { name: "Owerri", img: IMG.lifestyle, large: false },
  { name: "Abuja", img: IMG.landscapeHero, large: false },
] as const;

export function FeaturedDestinations() {
  return (
    <section className="relative bg-surface py-20 md:py-28">
      <div className="bg-topo pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionFade>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted">Where we shine</p>
          <h2 className="mt-2 text-balance text-center font-serif text-3xl text-ink md:text-4xl">Featured destinations</h2>
          <div className="mx-auto mt-4 h-px w-20 bg-gold/50" />
        </SectionFade>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.slice(0, 2).map((d) => (
            <MotionCard key={d.name} className="group">
              <Link href={"/packages?city=" + encodeURIComponent(d.name)} className="block">
                <div className="relative h-64 overflow-hidden rounded-2xl border border-border/60 shadow-card md:h-80">
                  <Image src={d.img} alt={d.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                  <p className="absolute bottom-4 left-1/2 w-full -translate-x-1/2 text-center font-serif text-2xl text-white">
                    {d.name}
                  </p>
                </div>
              </Link>
            </MotionCard>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.slice(2).map((d) => (
            <MotionCard key={d.name} className="group">
              <Link href={"/packages?city=" + encodeURIComponent(d.name)} className="block">
                <div className="relative h-48 overflow-hidden rounded-2xl border border-border/60 shadow-card md:h-64">
                  <Image src={d.img} alt={d.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-4 left-1/2 w-full -translate-x-1/2 text-center font-serif text-xl text-white">
                    {d.name}
                  </p>
                </div>
              </Link>
            </MotionCard>
          ))}
        </div>
        <div className="mt-10 text-center text-sm text-muted">
          <span>Also in rotation: </span>
          <Link className="font-medium text-ink underline-offset-2 hover:underline" href="/packages?city=Ghana">
            Ghana
          </Link>{" "}
          ·{" "}
          <Link className="font-medium text-ink underline-offset-2 hover:underline" href="/packages?city=Benin Republic">
            Benin Republic
          </Link>
        </div>
        <p className="mt-3 text-center text-sm">
          Speak to our planners on{" "}
          <a className="text-gold-dark underline" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
            {SITE.phone}
          </a>{" "}
          or{" "}
          <Link href="/custom-trip" className="text-ink underline">
            request a private quote
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
