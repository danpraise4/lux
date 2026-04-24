"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import type { PublicPackage } from "@/lib/data/packages";
import { DEFAULT_DEPOSIT_PERCENT } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const steps: { id: Step; title: string }[] = [
  { id: 1, title: "Package" },
  { id: 2, title: "Dates" },
  { id: 3, title: "Guests" },
  { id: 4, title: "Logistics" },
  { id: 5, title: "Details" },
  { id: 6, title: "Terms" },
  { id: 7, title: "Deposit" },
];

export function BookingWizard({ packages }: { packages: PublicPackage[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [pending, start] = useTransition();

  const initialSlug = sp.get("package") || packages[0]?.slug || "";
  const [pkgSlug, setPkgSlug] = useState(initialSlug);
  const [startDate, setStartDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [logistics, setLogistics] = useState({
    airportPickup: false,
    cityTransfer: false,
    flightToDeparture: false,
    noAssistance: false,
  });
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(() => packages.find((p) => p.slug === pkgSlug), [packages, pkgSlug]);
  const total = selected ? selected.priceFrom * travelers : 0;
  const deposit = Math.round(total * DEFAULT_DEPOSIT_PERCENT);

  function next() {
    setError(null);
    if (step === 1 && !pkgSlug) {
      setError("Choose a package");
      return;
    }
    if (step === 2 && !startDate) {
      setError("Pick a start date");
      return;
    }
    if (step === 5 && (!leadName || !leadEmail || !leadPhone)) {
      setError("Complete lead guest details");
      return;
    }
    if (step === 6 && !terms) {
      setError("Accept terms to continue");
      return;
    }
    setStep((s) => Math.min(7, (s + 1) as Step) as Step);
  }
  function back() {
    setError(null);
    setStep((s) => Math.max(1, (s - 1) as Step) as Step);
  }

  function pay() {
    if (!selected || !startDate) return;
    setError(null);
    start(async () => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageSlug: selected.slug,
          startDate,
          travelersCount: travelers,
          logistics,
          leadName,
          leadEmail,
          leadPhone,
          termsAccepted: terms,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reference?: string;
        depositAmount?: number;
        email?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.reference) {
        setError(data.error || "Could not create booking");
        return;
      }
      const init = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          amount: data.depositAmount,
          reference: data.reference,
        }),
      });
      const pay = (await init.json()) as { authorizationUrl?: string; demo?: boolean; error?: string };
      if (pay.authorizationUrl) {
        window.location.href = pay.authorizationUrl;
        return;
      }
      router.push(`/booking/confirmation?ref=${encodeURIComponent(data.reference)}&demo=1`);
    });
  }

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-4 py-8 sm:py-10 md:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Booking</p>
          <h1 className="font-serif text-2xl text-ink sm:text-3xl">Reserve your journey</h1>
        </div>
        <div className="-mx-1 flex gap-1 overflow-x-auto pb-1 text-xs text-muted no-scrollbar sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {steps.map((s) => (
            <span
              key={s.id}
              className={`shrink-0 rounded-full px-2.5 py-1 sm:py-0.5 ${step === s.id ? "bg-ink text-white" : "bg-border/60"}`}
            >
              {s.id}. {s.title}
            </span>
          ))}
        </div>
      </div>

      {selected && (
        <div className="mb-6 flex min-w-0 items-center gap-3 rounded-2xl border border-border/80 bg-surface p-3">
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-24">
            <Image src={selected.coverImage} alt="" fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted">{selected.destination}</p>
            <p className="font-serif text-base leading-tight sm:text-lg">{selected.title}</p>
            <p className="text-xs text-muted">From {formatNaira(selected.priceFrom)} / guest</p>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <Label className="text-ink">Package</Label>
                <select
                  className="mt-2 w-full min-w-0 rounded-md border border-border bg-surface p-2.5 text-base md:p-2 md:text-sm"
                  value={pkgSlug}
                  onChange={(e) => setPkgSlug(e.target.value)}
                >
                  {packages.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <Label className="text-ink">Preferred start date</Label>
                <Input className="mt-2" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <p className="mt-2 text-xs text-muted">We&apos;ll confirm availability before charging your card.</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                <Label className="text-ink">Number of travelers</Label>
                <Input
                  className="mt-2"
                  type="number"
                  min={1}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-3">
                <p className="text-sm text-muted">Add on-ground help (optional, may adjust final quote):</p>
                {(
                  [
                    ["airportPickup", "Airport pickup"],
                    ["cityTransfer", "City / hotel transfers"],
                    ["flightToDeparture", "Flight to departure city"],
                    ["noAssistance", "No additional assistance needed"],
                  ] as const
                ).map(([k, label]) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={logistics[k]}
                      onCheckedChange={(c) => setLogistics((L) => ({ ...L, [k]: Boolean(c) }))}
                    />
                    {label}
                  </label>
                ))}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="s5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-3"
              >
                <div>
                  <Label>Lead guest name</Label>
                  <Input className="mt-1" value={leadName} onChange={(e) => setLeadName(e.target.value)} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1" type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} required />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input className="mt-1" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} required />
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="s6" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-3 text-sm text-muted">
                <label className="flex items-start gap-2">
                  <Checkbox checked={terms} onCheckedChange={(c) => setTerms(Boolean(c))} className="mt-1" />
                  <span>
                    I understand deposits are used to hold inventory and that final balances are due before travel unless
                    otherwise agreed. I accept NMA Luxe&apos;s planning terms and cancellation windows shared at booking.
                  </span>
                </label>
                <p className="text-xs">Need custom flexibility? We&apos;ll note it on your file during confirmation.</p>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div key="s7" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-2">
                <p className="text-sm text-muted">Trip estimate (before logistics adjustments)</p>
                <p className="break-words font-serif text-2xl text-ink sm:text-3xl">{formatNaira(total)}</p>
                <p className="text-sm">
                  Due today ({Math.round(DEFAULT_DEPOSIT_PERCENT * 100)}% deposit):
                  <span className="ml-1 font-semibold text-gold-dark">{formatNaira(deposit)}</span>
                </p>
                <p className="text-xs text-muted">You&apos;ll complete payment on Paystack. If Paystack is not configured, you&apos;ll see a preview confirmation path.</p>
                <Button className="mt-4 w-full" variant="gold" size="lg" onClick={pay} disabled={pending}>
                  {pending ? "Processing…" : "Pay deposit securely"}
                </Button>
                <p className="text-xs text-muted text-center">Secure payment · SSL encrypted</p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {step < 7 && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={back} disabled={step === 1}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="button" className="w-full sm:w-auto" onClick={next} variant="gold">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm text-muted">
        Prefer a human touch? <Link className="text-gold" href={"/custom-trip"}>Request a custom trip</Link>
      </p>
    </div>
  );
}
