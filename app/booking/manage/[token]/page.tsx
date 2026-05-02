import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { ManageBookingPanel } from "./manage-booking-panel";

export const metadata: Metadata = {
  title: "Manage booking",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ token: string }> };

export default async function ManageBookingPage({ params }: Props) {
  const { token } = await params;
  if (!token || !isDbConfigured()) {
    notFound();
  }
  const conn = await connectDB();
  if (!conn) {
    notFound();
  }

  const doc = await Booking.findOne({ manageToken: token }).lean();
  if (!doc || !doc.manageToken) {
    notFound();
  }

  const booking = {
    reference: doc.reference,
    packageTitle: doc.packageTitle,
    status: doc.status,
    priceTotal: doc.priceTotal,
    depositAmount: doc.depositAmount,
    balanceAmount: doc.balanceAmount,
    balancePaid: !!doc.balancePaid,
    manageToken: doc.manageToken,
    leadName: doc.leadName,
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-12 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">Booking</p>
        <h1 className="mt-2 font-serif text-2xl text-ink md:text-3xl">Hello, {booking.leadName.split(" ")[0]}</h1>
        <p className="mt-2 text-sm text-muted">
          Review your trip estimate and pay any remaining balance when you&apos;re ready.
        </p>
        <div className="mt-8">
          <ManageBookingPanel booking={booking} />
        </div>
      </div>
    </SiteShell>
  );
}
