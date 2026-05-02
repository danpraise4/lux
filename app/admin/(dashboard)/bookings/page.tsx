import Link from "next/link";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { formatNaira } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type Row = {
  _id: string;
  reference: string;
  leadName: string;
  startDate: Date;
  priceTotal: number;
  balanceAmount: number;
  balancePaid: boolean;
  status: string;
};

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default async function AdminBookingsPage() {
  let rows: Row[] = [];
  if (isDbConfigured()) {
    const conn = await connectDB();
    if (conn) {
      const list = await Booking.find().sort({ createdAt: -1 }).limit(100).lean();
      rows = list.map((b) => ({
        _id: String(b._id),
        reference: b.reference,
        leadName: b.leadName,
        startDate: b.startDate,
        priceTotal: b.priceTotal,
        balanceAmount: b.balanceAmount,
        balancePaid: !!b.balancePaid,
        status: b.status,
      }));
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-zinc-900">Bookings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Select a booking to view guest details, logistics, amounts, and to update status or send a revised quote. Rows open
          the full record — everything else happens on that page.
        </p>
      </div>

      {!rows.length ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center text-sm text-zinc-600">
          No bookings yet. They appear here when guests complete checkout from the website.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="hidden border-b border-zinc-100 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 md:grid md:grid-cols-[1fr_1fr_minmax(0,100px)_minmax(0,120px)_minmax(0,140px)_auto] md:gap-4 md:px-4">
            <span>Reference</span>
            <span>Guest</span>
            <span>Start</span>
            <span>Trip total</span>
            <span>Balance</span>
            <span className="text-right">Status</span>
          </div>
          <ul className="divide-y divide-zinc-100">
            {rows.map((b) => (
              <li key={b._id}>
                <Link
                  href={`/admin/bookings/${b._id}`}
                  className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-zinc-50 md:grid md:grid-cols-[1fr_1fr_minmax(0,100px)_minmax(0,120px)_minmax(0,140px)_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center justify-between gap-2 md:justify-start">
                    <span className="font-mono text-sm font-medium text-gold-dark">{b.reference}</span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-600 md:hidden" />
                  </div>
                  <span className="text-sm font-medium text-zinc-900">{b.leadName}</span>
                  <span className="text-sm text-zinc-700">{b.startDate.toLocaleDateString()}</span>
                  <span className="text-sm tabular-nums text-zinc-900">{formatNaira(b.priceTotal)}</span>
                  <span className="text-sm tabular-nums text-zinc-700">
                    {b.balancePaid ? "—" : formatNaira(b.balanceAmount)}
                  </span>
                  <div className="flex items-center justify-end gap-2">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium capitalize text-zinc-800">
                      {statusLabel(b.status)}
                    </span>
                    <ChevronRight className="hidden h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-600 md:block" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
