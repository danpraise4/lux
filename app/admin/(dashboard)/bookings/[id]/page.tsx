import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { ChevronLeft } from "lucide-react";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { formatNaira } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import {
  BookingPricingForm,
  BookingStatusForm,
  MarkSettledForm,
} from "@/components/admin/booking-admin-forms";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ id: string }> };

function statusBadgeVariant(status: string): "default" | "gold" | "outline" | "popular" {
  if (status === "paid") return "popular";
  if (status === "cancelled") return "outline";
  if (status === "balance_due" || status === "pending_deposit") return "gold";
  return "default";
}

export default async function AdminBookingDetailPage({ params }: Props) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  if (!isDbConfigured()) {
    return (
      <div>
        <p className="text-sm text-zinc-600">Database is not configured.</p>
        <Link href="/admin/bookings" className="mt-3 inline-block text-sm text-gold underline">
          Back to bookings
        </Link>
      </div>
    );
  }

  const conn = await connectDB();
  if (!conn) {
    return (
      <div>
        <p className="text-sm text-zinc-600">Could not connect to the database.</p>
        <Link href="/admin/bookings" className="mt-3 inline-block text-sm text-gold underline">
          Back to bookings
        </Link>
      </div>
    );
  }

  const doc = await Booking.findById(id).lean();
  if (!doc) {
    notFound();
  }

  const manageBase = (process.env.NEXT_PUBLIC_SITE_URL || SITE.url || "").replace(/\/$/, "");
  const guestPayLink = doc.manageToken ? `${manageBase}/booking/manage/${encodeURIComponent(doc.manageToken)}` : "";

  const logistics = (doc.logistics || {}) as {
    airportPickup?: boolean;
    cityTransfer?: boolean;
    flightToDeparture?: boolean;
    noAssistance?: boolean;
  };
  const extras = [
    logistics.airportPickup && "Airport pickup",
    logistics.cityTransfer && "City / hotel transfers",
    logistics.flightToDeparture && "Flight to departure city",
    logistics.noAssistance && "No extra assistance",
  ].filter(Boolean);

  return (
    <div className="min-w-0 max-w-3xl space-y-8">
      <div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          <ChevronLeft className="h-4 w-4" />
          All bookings
        </Link>
      </div>

      <header className="space-y-2 border-b border-zinc-200 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-zinc-500">{doc.reference}</span>
          <Badge variant={statusBadgeVariant(doc.status)}>{doc.status.replace(/_/g, " ")}</Badge>
          {doc.balancePaid ? (
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
              Paid in full
            </span>
          ) : null}
        </div>
        <h1 className="font-serif text-2xl text-zinc-900 md:text-3xl">{doc.packageTitle}</h1>
        <p className="text-sm text-zinc-600">
          Start {doc.startDate instanceof Date ? doc.startDate.toLocaleDateString(undefined, { dateStyle: "long" }) : "—"} ·{" "}
          {doc.travelersCount} traveler{doc.travelersCount === 1 ? "" : "s"}
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Guest contact</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-zinc-500">Name</dt>
              <dd className="font-medium text-zinc-900">{doc.leadName}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Email</dt>
              <dd>
                <a href={`mailto:${doc.leadEmail}`} className="font-medium text-gold underline">
                  {doc.leadEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Phone</dt>
              <dd className="font-medium text-zinc-900">{doc.leadPhone}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Logistics &amp; extras</h2>
          <ul className="mt-3 list-inside list-disc text-sm text-zinc-800">
            {extras.length ? (
              extras.map((x) => (
                <li key={String(x)}>{x}</li>
              ))
            ) : (
              <li className="list-none text-zinc-500">None selected</li>
            )}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Money</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 px-4 py-3">
            <dt className="text-zinc-500">Trip total</dt>
            <dd className="font-serif text-xl text-zinc-900">{formatNaira(doc.priceTotal)}</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-4 py-3">
            <dt className="text-zinc-500">Deposit portion (reference)</dt>
            <dd className="font-medium text-zinc-900">{formatNaira(doc.depositAmount)}</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-4 py-3">
            <dt className="text-zinc-500">Balance due</dt>
            <dd className="font-medium text-zinc-900">{doc.balancePaid ? "—" : formatNaira(doc.balanceAmount)}</dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-4 py-3">
            <dt className="text-zinc-500">First checkout</dt>
            <dd className="font-medium capitalize text-zinc-900">{doc.initialPaymentChoice || "deposit"}</dd>
          </div>
        </dl>
      </section>

      {guestPayLink ? (
        <section className="rounded-xl border border-dashed border-amber-200 bg-amber-50/40 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-900/80">Guest payment link</h2>
          <p className="mt-2 text-sm text-zinc-700">
            Share only with the guest — they can pay the remaining balance here.
          </p>
          <code className="mt-3 block break-all rounded-lg bg-white px-3 py-2 text-xs text-zinc-800 ring-1 ring-zinc-200">
            {guestPayLink}
          </code>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Update status</h2>
        <BookingStatusForm bookingId={String(doc._id)} defaultStatus={doc.status} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Adjust quote</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Change the trip total when add-ons are confirmed. Optionally email the guest with their payment page.
          </p>
        </div>
        <BookingPricingForm
          bookingId={String(doc._id)}
          defaultPriceTotal={doc.priceTotal}
          defaultPricingNote={doc.pricingNoteFromAdmin || ""}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Manual settlement</h2>
        <p className="text-sm text-zinc-600">
          If the guest paid outside Flutterwave/Paystack (bank transfer, cash), mark the booking settled here after you
          reconcile.
        </p>
        <MarkSettledForm bookingId={String(doc._id)} disabled={doc.balancePaid || doc.status === "paid"} />
      </section>
    </div>
  );
}
