"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/home/search-bar";
import { IMG } from "@/lib/site-images";

const slides = [
  {
    script: "Amazing tours to",
    headline: "Nigeria",
    image: IMG.landscapeWide,
    reviews: "80+",
    rating: 4.8,
    searchCity: "Lagos",
  },
  {
    script: "Vacation & holiday tours to",
    headline: "Ghana",
    image: IMG.landscapeHero,
    reviews: "87+",
    rating: 4.9,
    searchCity: "Ghana",
  },
  {
    script: "Curated escapes in",
    headline: "Jos",
    image: IMG.jos,
    reviews: "45+",
    rating: 4.8,
    searchCity: "Jos",
  },
] as const;

export function HomeHero() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearInterval(t);
  }, [reduce]);

  const s = slides[index];

  return (
    <section className="relative -mt-20 flex min-h-[min(100dvh,920px)] flex-col overflow-visible text-white md:-mt-24 md:min-h-[92vh]">
      {/* Match SiteShell pt-20 / md:pt-24; extend bg up so no cream strip under the fixed header */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -top-20 overflow-hidden md:-top-24"
        aria-hidden
      >
        {slides.map((sl, i) => (
          <div
            key={sl.image}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={sl.image} alt="" fill priority={i === 0} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/55" />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        className="absolute left-1 top-[42%] z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-2 sm:h-11 sm:w-11 md:top-1/2 lg:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
        className="absolute right-1 top-[42%] z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-2 sm:h-11 sm:w-11 md:top-1/2 lg:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-20 md:pt-24">
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-6 text-center md:pb-8">
          <motion.p
            className="font-[family-name:var(--font-great-vibes)] text-xl text-white/95 sm:text-2xl md:text-3xl lg:text-4xl"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            key={s.script + index}
          >
            {s.script}
          </motion.p>
          <motion.h1
            className="mt-1 max-w-4xl text-balance font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            key={s.headline + index}
          >
            {s.headline}
          </motion.h1>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-white/90">
            <span>{s.reviews} reviews</span>
            <span className="text-white/50">|</span>
            <span className="inline-flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.floor(s.rating) ? "fill-gold text-gold" : "fill-gold/35 text-gold/50"}`}
                />
              ))}
            </span>
            <span className="font-medium">{s.rating}/5</span>
          </div>
          <motion.div
            className="mt-8"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            key={"cta" + index}
          >
            <Button
              asChild
              size="lg"
              className="rounded-md border-2 border-white/90 bg-transparent px-8 text-white shadow-none backdrop-blur-sm hover:bg-white/10"
              variant="hero"
            >
              <Link href={`/packages?city=${encodeURIComponent(s.searchCity)}`}>
                Take me there
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <div className="mt-8 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full border border-white/35 transition ${
                  i === index ? "bg-gold shadow-[0_0_0_2px_rgba(255,255,255,0.35)]" : "bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Search sits in flow at bottom of hero — not clipped; slight overlap via negative margin + z-index */}
        <div className="relative z-20 px-3 pb-6 pt-2 sm:px-5 sm:pb-8 md:px-8 md:pb-10">
          <div className="mx-auto w-full max-w-6xl xl:max-w-7xl">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}
