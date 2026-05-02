"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";

export type ManageBookingPayload = {
  reference: string;
  packageTitle: string;
  status: string;
  priceTotal: number;
  depositAmount: number;
  balanceAmount: number;
  balancePaid: boolean;
  manageToken: string;
  leadName: string;
};

export function ManageBookingPanel({ booking }: { booking: ManageBookingPayload }) {
  const [pending, start] = useTransition();
  const blockedPay = ["paid", "cancelled", "pending_deposit"].includes(booking.status);
  const canPayBalance = !blockedPay && !booking.balancePaid && booking.balanceAmount > 0;

  function payBalance() {
    start(async () => {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manageToken: booking.manageToken }),
      });
      const data = (await res.json()) as { authorizationUrl?: string; error?: string };
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      alert(data.error || "Could not start payment");
    });
  }

  const paidSummary =
    booking.balancePaid || booking.status === "paid" ? (
      <p className="text-sm font-medium text-emerald-800">This booking is paid in full. Thank you.</p>
    ) : booking.status === "pending_deposit" ? (
      <p className="text-sm text-muted">
        We&apos;re waiting for your first payment. Please use the checkout link from your booking confirmation email, or{" "}
        <Link href="/booking" className="text-gold underline">
          start checkout again
        </Link>
        .
      </p>
    ) : null;

  return (
    <div className="space-y-6 text-left">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Booking reference</p>
        <p className="font-mono text-lg text-ink">{booking.reference}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Tour</p>
        <p className="text-ink">{booking.packageTitle}</p>
      </div>
      <div className="rounded-xl border border-border/80 bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Trip estimate</p>
        <p className="font-serif text-2xl text-ink">{formatNaira(booking.priceTotal)}</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Deposit portion ({booking.balancePaid ? "paid" : "—"})</dt>
            <dd className="font-medium">{formatNaira(booking.depositAmount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Balance</dt>
            <dd className="font-medium">
              {booking.balancePaid ? "—" : formatNaira(booking.balanceAmount)}
            </dd>
          </div>
        </dl>
      </div>

      {paidSummary}

      {canPayBalance ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Pay the remaining <strong className="text-ink">{formatNaira(booking.balanceAmount)}</strong> securely below.
          </p>
          <Button type="button" variant="gold" size="lg" className="w-full" disabled={pending} onClick={payBalance}>
            {pending ? "Opening checkout…" : `Pay balance (${formatNaira(booking.balanceAmount)})`}
          </Button>
        </div>
      ) : null}

      <p className="text-xs text-muted">
        Questions? Reply to your confirmation email or contact us from the website.
      </p>
    </div>
  );
}
