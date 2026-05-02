"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import type { PublicPackage } from "@/lib/data/packages";
import { MotionCard } from "@/components/motion/motion-card";
import { SectionFade } from "@/components/motion/section-fade";

const cities = ["All", "Jos", "Lagos", "Owerri", "Port Harcourt", "Ghana", "Benin Republic", "Lagos (hub)"];
const budgets = [
  { id: "all", label: "Any budget", min: 0, max: 1e12 },
  { id: "under500", label: "Under ₦500k", min: 0, max: 500000 },
  { id: "500-1m", label: "₦500k – ₦1m", min: 500000, max: 1000000 },
  { id: "1mplus", label: "₦1m+", min: 1000000, max: 1e12 },
] as const;
const durations = ["All", "1–2 days", "3–4 days", "5+"] as const;
const types = [
  { id: "all", label: "Any" },
  { id: "group", label: "Group" },
  { id: "solo", label: "Solo" },
] as const;
const vibes = [
  { id: "all", label: "Any" },
  { id: "adventure", label: "Adventure" },
  { id: "relaxation", label: "Relaxation" },
  { id: "cultural", label: "Cultural" },
] as const;

function durationFromSearchParams(sp: URLSearchParams): (typeof durations)[number] {
  const d = sp.get("duration");
  if (d === "1-2") return "1–2 days";
  if (d === "3-4") return "3–4 days";
  if (d === "5+") return "5+";
  return "All";
}

export function PackagesView({ initial }: { initial: PublicPackage[] }) {
  const sp = useSearchParams();
  const [city, setCity] = useState(() => sp.get("city") || "All");
  const [bud, setBud] = useState("all");
  const [dur, setDur] = useState<typeof durations[number]>(() => durationFromSearchParams(sp));
  const [gtype, setGtype] = useState("all");
  const [vibe, setVibe] = useState(() => sp.get("vibe") || "all");

  const list = useMemo(() => {
    return initial.filter((p) => {
      if (city !== "All") {
        const matchCity = p.city === city;
        const matchDest = p.destination === city;
        if (!matchCity && !matchDest) return false;
      }
      const b = budgets.find((x) => x.id === bud) || budgets[0]!;
      if (p.priceFrom < b.min || p.priceFrom > b.max) return false;
      if (dur === "1–2 days" && p.durationDays > 2) return false;
      if (dur === "3–4 days" && (p.durationDays < 3 || p.durationDays > 4)) return false;
      if (dur === "5+" && p.durationDays < 5) return false;
      if (gtype === "group" && p.groupOrSolo === "solo") return false;
      if (gtype === "solo" && p.groupOrSolo === "group") return false;
      if (vibe !== "all" && p.vibe !== vibe) return false;
      return true;
    });
  }, [initial, city, bud, dur, gtype, vibe]);

  return (
    <div className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:py-12 md:px-6 lg:px-8">
      <SectionFade>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Curated for you</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Signature packages</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">Filter by city, budget, and mood — or speak to the desk for a bespoke build.</p>
      </SectionFade>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border/80 bg-surface/80 p-4 shadow-sm md:flex-row md:flex-wrap md:items-end">
        <div className="flex shrink-0 items-center gap-2 text-sm text-muted md:me-1">
          <SlidersHorizontal className="h-4 w-4 shrink-0" />
          Filters
        </div>
        <label className="min-w-0 flex-1 text-sm md:min-w-[9.5rem]">
          <span className="text-xs uppercase tracking-wide text-muted">City</span>
          <select
            className="mt-1 w-full min-w-0 rounded-md border border-border bg-surface p-2.5 text-base md:p-2 md:text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 flex-1 text-sm md:min-w-[9.5rem]">
          <span className="text-xs uppercase tracking-wide text-muted">Budget</span>
          <select
            className="mt-1 w-full min-w-0 rounded-md border border-border bg-surface p-2.5 text-base md:p-2 md:text-sm"
            value={bud}
            onChange={(e) => setBud(e.target.value)}
          >
            {budgets.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 flex-1 text-sm md:min-w-[9.5rem]">
          <span className="text-xs uppercase tracking-wide text-muted">Duration</span>
          <select
            className="mt-1 w-full min-w-0 rounded-md border border-border bg-surface p-2.5 text-base md:p-2 md:text-sm"
            value={dur}
            onChange={(e) => setDur(e.target.value as (typeof durations)[number])}
          >
            {durations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 flex-1 text-sm md:min-w-[9.5rem]">
          <span className="text-xs uppercase tracking-wide text-muted">Style</span>
          <select
            className="mt-1 w-full min-w-0 rounded-md border border-border bg-surface p-2.5 text-base md:p-2 md:text-sm"
            value={gtype}
            onChange={(e) => setGtype(e.target.value)}
          >
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="min-w-0 flex-1 text-sm md:min-w-[9.5rem]">
          <span className="text-xs uppercase tracking-wide text-muted">Vibe</span>
          <select
            className="mt-1 w-full min-w-0 rounded-md border border-border bg-surface p-2.5 text-base md:p-2 md:text-sm"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
          >
            {vibes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <MotionCard key={p.slug}>
            <Card className="overflow-hidden border-border/70">
              <div className="relative h-48">
                <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
                {p.featured && (
                  <Badge className="absolute left-3 top-3" variant="popular">
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="space-y-2 p-5">
                <p className="text-xs text-muted">{p.destination}</p>
                <h2 className="font-serif text-xl leading-snug">{p.title}</h2>
                <p className="line-clamp-2 text-sm text-muted">{p.shortSummary}</p>
                <div className="flex items-center justify-between pt-2 text-sm">
                  <span className="text-gold-dark">{formatNaira(p.priceFrom)}</span>
                  <span className="text-muted">{p.durationDays} days</span>
                </div>
                <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                  <Button asChild className="w-full rounded-full sm:flex-1" variant="default">
                    <Link href={"/packages/" + p.slug}>View details</Link>
                  </Button>
                  <Button asChild className="w-full rounded-full sm:w-auto" variant="gold">
                    <Link href={"/booking?package=" + encodeURIComponent(p.slug)}>Book</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </MotionCard>
        ))}
        {!list.length && (
          <p className="col-span-full text-center text-sm text-muted">
            {initial.length === 0
              ? "No tours published yet."
              : 'No exact matches — try widening filters or contact the desk.'}
          </p>
        )}
      </div>
    </div>
  );
}
