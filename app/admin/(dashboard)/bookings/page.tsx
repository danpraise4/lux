import { isDbConfigured, connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { formatNaira } from "@/lib/utils";
export default async function AdminBookingsPage() {
  let rows: { _id: string; reference: string; leadName: string; startDate: Date; priceTotal: number; status: string }[] = [];
  if (isDbConfigured()) {
    const conn = await connectDB();
    if (conn) {
      const list = await Booking.find().sort({ createdAt: -1 }).limit(50).lean();
      rows = list.map((b) => ({
        _id: String(b._id),
        reference: b.reference,
        leadName: b.leadName,
        startDate: b.startDate,
        priceTotal: b.priceTotal,
        status: b.status,
      }));
    }
  }
  return (
    <div>
      <h1 className="font-serif text-2xl">Bookings</h1>
      <p className="text-sm text-zinc-600">Update status, mark deposits, and export from your ops workflow.</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-3">Ref</th>
              <th className="p-3">Lead</th>
              <th className="p-3">Start</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((b) => (
                <tr key={b._id} className="border-b border-zinc-100 last:border-0">
                  <td className="p-3 font-mono text-sm">{b.reference}</td>
                  <td className="p-3">{b.leadName}</td>
                  <td className="p-3">{b.startDate.toLocaleDateString()}</td>
                  <td className="p-3">{formatNaira(b.priceTotal)}</td>
                  <td className="p-3">{b.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-zinc-500" colSpan={5}>
                  No bookings yet (or connect MongoDB).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
