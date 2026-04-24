"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { IMG } from "@/lib/site-images";

const nav = [
  { href: "/packages", label: "Packages" },
  { href: "/custom-trip", label: "Custom Trip" },
  { href: "/corporate-travel", label: "Corporate" },
  { href: "/group-travel", label: "Group Travel" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors duration-300",
        scrolled
          ? "border-border/60 bg-surface/90 backdrop-blur-md shadow-[var(--shadow-soft)]"
          : "bg-gradient-to-b from-black/30 to-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4 md:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gold/40 bg-ink text-white">
            <Image
              src={IMG.lifestyle}
              alt="N. M. A Luxe"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 font-serif text-xs font-bold tracking-widest">
              NMA
            </div>
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span
              className={cn("font-serif text-sm font-semibold", scrolled ? "text-ink" : "text-white drop-shadow")}
            >
              {SITE.shortName}
            </span>
            <span
              className={cn(
                "text-[0.65rem] uppercase tracking-[0.2em]",
                scrolled ? "text-muted" : "text-white/80"
              )}
            >
              Travel &amp; Tour
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition",
                scrolled ? "text-ink/80 hover:text-gold" : "text-white/90 hover:text-gold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-sm"
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border bg-surface/80",
                scrolled ? "border-gold/30 text-gold" : "border-white/30 text-gold"
              )}
            >
              <Phone className="h-4 w-4" />
            </span>
            <span
              className={cn("hidden font-medium xl:inline", scrolled ? "text-ink/80" : "text-white drop-shadow")}
            >
              {SITE.phone}
            </span>
          </a>
          <Button
            asChild
            size="pill"
            className="hidden sm:inline-flex"
            variant={scrolled ? "gold" : "hero"}
          >
            <Link href="/packages">Explore Packages</Link>
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden",
            scrolled ? "border-border" : "border-white/40 text-white"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border bg-surface px-4 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="w-full" variant="gold">
              <Link href="/packages" onClick={() => setOpen(false)}>
                Explore Packages
              </Link>
            </Button>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-ink"
              onClick={() => setOpen(false)}
            >
              <Phone className="h-4 w-4 text-gold" />
              Call {SITE.phone}
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
