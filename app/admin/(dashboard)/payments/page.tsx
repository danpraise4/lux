import Link from "next/link";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { formatNaira } from "@/lib/utils";

type PayRow = {
  _id: string;
  amount: number;
  type: string;
  status: string;
  paystackRef: string;
  paidAt?: Date | null;
  createdAt?: Date | null;
  bookingRef?: string;
  bookingLead?: string;
};

export default async function AdminPaymentsPage() {
  let payments: PayRow[] = [];
  let pendingDeposit = 0;
  let balanceDueBookings = 0;
  let succeededSum = 0;

  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) {
      const list = await Payment.find()
        .sort({ createdAt: -1 })
        .limit(120)
        .populate("booking", "reference leadName")
        .lean();

      payments = list.map((p: unknown) => {
        const raw = p as {
          _id: { toString: () => string };
          amount: number;
          type: string;
          status: string;
          paystackRef?: string;
          paidAt?: Date;
          createdAt?: Date;
          booking?: { reference?: string; leadName?: string } | null;
        };
        return {
          _id: raw._id.toString(),
          amount: raw.amount,
          type: raw.type,
          status: raw.status,
          paystackRef: raw.paystackRef || "",
          paidAt: raw.paidAt,
          createdAt: raw.createdAt,
          bookingRef: raw.booking?.reference || "",
          bookingLead: raw.booking?.leadName || "",
        };
      });

      pendingDeposit = await Booking.countDocuments({ status: "pending_deposit" });
      balanceDueBookings = await Booking.countDocuments({ status: "balance_due", balancePaid: false });
      succeededSum = payments.filter((x) => x.status === "success").reduce((a, x) => a + x.amount, 0);
    }
  }

  return (
    <div className="min-w-0">
      <h1 className="font-serif text-2xl">Payments</h1>
      <p className="mt-2 max-w-prose text-sm text-zinc-600">
        Payments recorded from checkout appear here. Manage booking stages and balances under{" "}
        <Link className="font-medium text-gold-dark underline" href="/admin/bookings">
          Bookings
        </Link>
        .
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Bookings awaiting deposit" value={String(pendingDeposit)} />
        <Stat label="Bookings with balance showing due" value={String(balanceDueBookings)} />
        <Stat label="Sum of successful rows (shown)" value={formatNaira(Math.round(succeededSum))} />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Reference</th>
              <th className="p-3">Booking</th>
            </tr>
          </thead>
          <tbody>
            {payments.length ? (
              payments.map((r) => (
                <tr key={r._id} className="border-b border-zinc-100 last:border-0">
                  <td className="whitespace-nowrap p-3 text-zinc-600">
                    {(r.paidAt || r.createdAt) instanceof Date ? (r.paidAt || r.createdAt)!.toLocaleString() : "—"}
                  </td>
                  <td className="p-3">{r.type}</td>
                  <td className="p-3 font-medium">{formatNaira(Math.round(r.amount))}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="line-clamp-2 max-w-[10rem] p-3 font-mono text-[11px]">{r.paystackRef || "—"}</td>
                  <td className="p-3 text-zinc-700">
                    {r.bookingRef ? (
                      <span className="min-w-0">
                        <span className="font-medium">{r.bookingRef}</span>
                        <span className="block truncate text-xs text-zinc-500">{r.bookingLead}</span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-6 text-zinc-500" colSpan={6}>
                  No payments recorded yet. They appear after guests pay online.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
