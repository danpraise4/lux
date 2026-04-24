"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { SectionFade } from "@/components/motion/section-fade";
import { IMG } from "@/lib/site-images";

const data = [
  {
    name: "Amanda T.",
    place: "Accra, Ghana",
    quote: "NMA made our highland break feel effortless. Transfers, meals, the pace — we simply arrived and enjoyed.",
    img: IMG.jos,
  },
  {
    name: "Chidi O.",
    place: "Lagos, Nigeria",
    quote: "Our leadership offsite was elevated without being fussy. Clear invoices and an on-the-ground team that cared.",
    img: IMG.lifestyle,
  },
  {
    name: "Ezinne K.",
    place: "Port Harcourt, Nigeria",
    quote: "The school trip manifest was a relief — chaperone lists, bus timing, and parents kept in the loop.",
    img: IMG.portHarcourtBeach,
  },
] as const;

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = data[i];
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <SectionFade>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Testimonials</p>
            <h2 className="mt-3 font-serif text-2xl text-ink sm:text-3xl md:text-4xl">What our guests say</h2>
            <div className="relative mt-6 h-64 overflow-hidden rounded-2xl border border-border/60 shadow-card md:h-80">
              <Image
                src={IMG.landscapeWide}
                alt="Travelers"
                fill
                className="object-cover"
              />
            </div>
          </SectionFade>

          <SectionFade>
            <motion.div
              key={t.quote}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative min-w-0 overflow-hidden rounded-2xl border border-dashed border-white/40 bg-ink p-5 text-white shadow-2xl sm:rounded-[2rem] sm:p-8"
            >
              <p className="font-serif text-base italic leading-relaxed text-white/95 sm:text-lg md:text-2xl">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20">
                  <Image src={t.img} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-white/60">{t.place}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                {data.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setI(idx)}
                    className={`h-2.5 w-2.5 rounded-full ${idx === i ? "bg-white" : "bg-white/30"}`}
                    aria-label={`Testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </SectionFade>
        </div>
      </div>
    </section>
  );
}
