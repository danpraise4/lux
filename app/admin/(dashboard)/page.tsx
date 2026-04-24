import { auth } from "@/auth";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import CustomTripRequest from "@/models/CustomTripRequest";
import CorporateLead from "@/models/CorporateLead";

export default async function AdminHomePage() {
  const session = await auth();
  let bookings = 0;
  let pendingBalance = 0;
  let trips = 0;
  let inquiries = 0;
  let revenue = 0;

  if (isDbConfigured()) {
    const conn = await connectDB();
    if (conn) {
      bookings = await Booking.countDocuments();
      pendingBalance = await Booking.countDocuments({ balancePaid: false, status: { $ne: "cancelled" } });
      const future = new Date();
      trips = await Booking.countDocuments({ startDate: { $gte: future }, status: { $in: ["confirmed", "balance_due", "paid"] } });
      const custom = await CustomTripRequest.countDocuments({ status: "new" });
      const corp = await CorporateLead.countDocuments({ status: { $in: ["new", "in_review"] } });
      inquiries = custom + corp;
      const payAgg = await Booking.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, t: { $sum: "$priceTotal" } } }]);
      revenue = payAgg[0]?.t || 0;
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl">Welcome{session?.user?.name ? `, ${session.user.name}` : ""}</h1>
      <p className="text-sm text-zinc-600">Connect MongoDB to populate live stats. Demo data shows zeros without `MONGODB_URI`.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total bookings", value: bookings },
          { label: "With balance due", value: pendingBalance },
          { label: "Upcoming trips", value: trips },
          { label: "New inquiries (custom + corporate)", value: inquiries },
          { label: "Recorded revenue (paid)", value: `₦${revenue.toLocaleString("en-NG")}` },
          { label: "Newsletter (if DB)", value: isDbConfigured() ? "see Newsletter tab" : "N/A" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
