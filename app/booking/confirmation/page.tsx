import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { runPaymentReturnHandlers } from "@/lib/payment-return";

export const metadata: Metadata = {
  title: "Booking received",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    ref?: string;
    demo?: string;
    trxref?: string;
    transaction_id?: string;
    tx_ref?: string;
    status?: string;
    reference?: string;
  }>;
};

export default async function BookingConfirmationPage({ searchParams }: Props) {
  const p = await searchParams;
  await runPaymentReturnHandlers(p);

  const ref = p.ref || p.tx_ref || p.reference || p.trxref || "—";
  const demo = p.demo === "1" || p.demo === "true";
  const paid = Boolean(p.transaction_id || p.reference || p.trxref || p.ref);

  return (
    <SiteShell>
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-4 font-serif text-3xl text-ink">You&apos;re on the calendar</h1>
        <p className="mt-2 text-sm text-muted">
          Reference <span className="font-mono text-ink">{ref}</span>
          {demo ? " — preview (no charge)" : null}
        </p>
        {!demo && paid ? (
          <p className="mt-2 text-sm text-emerald-800">
            If payment succeeded, a confirmation has been sent to your email.
          </p>
        ) : null}
        <p className="mt-4 text-sm text-muted">
          Our desk will confirm your dates, logistics add-ons, and final balance — usually within a few working hours.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="gold" className="rounded-full">
            <Link href="/packages">View more packages</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
