import Link from "next/link";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import CustomTripRequest from "@/models/CustomTripRequest";
import { ChevronRight } from "lucide-react";

type Row = {
  id: string;
  name: string;
  email: string;
  destination: string;
  status: string;
  createdAt: Date | null;
};

export default async function AdminCustomTripsPage() {
  let rows: Row[] = [];
  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) {
      const list = await CustomTripRequest.find().sort({ createdAt: -1 }).limit(80).lean();
      rows = list.map((r) => ({
        id: String(r._id),
        name: r.name,
        email: r.email,
        destination: r.destination || "",
        status: r.status,
        createdAt: r.createdAt instanceof Date ? r.createdAt : null,
      }));
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-zinc-900">Custom trip requests</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          From the public <Link className="text-gold-dark underline" href="/custom-trip">custom trip</Link> form. Open a
          row for full details, status updates, and guest emails.
        </p>
      </div>

      {!rows.length ? (
        <p className="text-sm text-zinc-600">No bespoke requests yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="hidden border-b border-zinc-100 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 md:grid md:grid-cols-[1fr_1fr_minmax(0,180px)_minmax(0,100px)_auto] md:gap-4 md:px-4">
            <span>Guest</span>
            <span>Email</span>
            <span>Destination</span>
            <span>Status</span>
            <span className="text-right">Received</span>
          </div>
          <ul className="divide-y divide-zinc-100">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/custom-trips/${r.id}`}
                  className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-zinc-50 md:grid md:grid-cols-[1fr_1fr_minmax(0,180px)_minmax(0,100px)_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center justify-between gap-2 md:justify-start">
                    <span className="font-medium text-zinc-900">{r.name}</span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-600 md:hidden" />
                  </div>
                  <span className="break-all font-mono text-xs text-zinc-700">{r.email}</span>
                  <span className="text-sm text-zinc-800">{r.destination?.trim() ? r.destination : "—"}</span>
                  <span className="text-sm capitalize text-zinc-800">{r.status}</span>
                  <div className="flex items-center justify-end gap-2">
                    <span className="whitespace-nowrap text-sm text-zinc-600">
                      {r.createdAt ? r.createdAt.toLocaleString() : "—"}
                    </span>
                    <ChevronRight
                      className="hidden h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-600 md:block"
                      aria-hidden
                    />
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
