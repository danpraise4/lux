"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, ChevronDown, Flag, Send, Users } from "lucide-react";
import { motion } from "framer-motion";

const cities = [
  { value: "", label: "Choose" },
  { value: "Jos", label: "Jos" },
  { value: "Lagos", label: "Lagos" },
  { value: "Port Harcourt", label: "Port Harcourt" },
  { value: "Owerri", label: "Owerri" },
  { value: "Abuja", label: "Abuja" },
  { value: "Ghana", label: "Ghana" },
  { value: "Benin Republic", label: "Benin Republic" },
] as const;

const activities = [
  { value: "", label: "Type" },
  { value: "adventure", label: "Adventure" },
  { value: "relaxation", label: "Relaxation" },
  { value: "cultural", label: "Cultural" },
  { value: "mixed", label: "Mixed" },
] as const;

const durations = [
  { value: "", label: "No. Of Days" },
  { value: "1-2", label: "1–2 days" },
  { value: "3-4", label: "3–4 days" },
  { value: "5+", label: "5+ days" },
] as const;

const guests = [
  { value: "", label: "(0)" },
  { value: "1", label: "1 guest" },
  { value: "2", label: "2 guests" },
  { value: "3-5", label: "3–5 guests" },
  { value: "6+", label: "6+ guests" },
] as const;

function FieldSegment({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-[3.75rem] flex-1 items-center gap-2.5 border-b border-neutral-200/90 px-3 py-2.5 sm:min-h-[4.5rem] sm:gap-3 sm:px-4 sm:py-3 md:min-h-[5rem] md:px-5 lg:min-h-0 lg:border-b-0 lg:border-r lg:py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dark sm:h-10 sm:w-10">
        <Icon className="h-[1.05rem] w-[1.05rem] sm:h-[1.15rem] sm:w-[1.15rem]" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-neutral-500">{label}</p>
        <div className="relative mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function StyledSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 cursor-pointer appearance-none bg-transparent py-0.5 pr-7 text-base font-medium text-neutral-900 outline-none transition hover:text-neutral-700 md:text-[0.9375rem]"
      >
        {options.map((o) => (
          <option key={o.value || "any"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        aria-hidden
      />
    </div>
  );
}

export function SearchBar() {
  const r = useRouter();
  const [destination, setDestination] = useState("");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [guestCount, setGuestCount] = useState("");

  function search() {
    const params = new URLSearchParams();
    if (destination) params.set("city", destination);
    if (activity) params.set("vibe", activity);
    if (duration) params.set("duration", duration);
    if (guestCount) params.set("guests", guestCount);
    r.push(`/packages?${params.toString()}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-xl border border-white/60 bg-white shadow-[0_25px_80px_-12px_rgba(0,0,0,0.35),0_12px_32px_-8px_rgba(0,0,0,0.18)]"
    >
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <FieldSegment icon={Send} label="Destination">
          <StyledSelect value={destination} onChange={setDestination} options={cities} />
        </FieldSegment>

        <FieldSegment icon={Flag} label="Activity">
          <StyledSelect value={activity} onChange={setActivity} options={activities} />
        </FieldSegment>

        <FieldSegment icon={CalendarDays} label="Duration">
          <StyledSelect value={duration} onChange={setDuration} options={durations} />
        </FieldSegment>

        <FieldSegment icon={Users} label="No. Of Guests">
          <StyledSelect value={guestCount} onChange={setGuestCount} options={guests} />
        </FieldSegment>

        <button
          type="button"
          onClick={search}
          className="flex min-h-[3rem] w-full shrink-0 touch-manipulation items-center justify-center bg-ink px-4 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-ink/88 active:bg-ink sm:min-h-[3.5rem] sm:px-6 lg:min-h-0 lg:w-[11.5rem] lg:min-w-[11.5rem] lg:px-4 xl:w-[12.5rem] xl:min-w-[12.5rem]"
        >
          Search Now
        </button>
      </div>
    </motion.div>
  );
}
