import Link from "next/link";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import CorporateLead from "@/models/CorporateLead";
import { ChevronRight } from "lucide-react";

type Row = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  status: string;
  createdAt: Date | null;
};

export default async function AdminCorporatePage() {
  let leads: Row[] = [];
  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) {
      const list = await CorporateLead.find().sort({ createdAt: -1 }).limit(50).lean();
      leads = list.map((l) => ({
        id: String(l._id),
        company: l.company,
        contactName: l.contactName,
        email: l.email,
        status: l.status,
        createdAt: l.createdAt instanceof Date ? l.createdAt : null,
      }));
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-zinc-900">Corporate requests</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          Open a row to view the full brief, update the pipeline stage, or send a reply email to the contact.
        </p>
      </div>

      {!leads.length ? (
        <p className="text-sm text-zinc-600">No corporate enquiries yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="hidden border-b border-zinc-100 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 md:grid md:grid-cols-[1fr_1fr_minmax(0,200px)_minmax(0,120px)_auto] md:gap-4 md:px-4">
            <span>Organisation</span>
            <span>Contact</span>
            <span>Email</span>
            <span>Stage</span>
            <span className="text-right">Received</span>
          </div>
          <ul className="divide-y divide-zinc-100">
            {leads.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/admin/corporate/${l.id}`}
                  className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-zinc-50 md:grid md:grid-cols-[1fr_1fr_minmax(0,200px)_minmax(0,120px)_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center justify-between gap-2 md:justify-start">
                    <span className="font-medium text-zinc-900">{l.company}</span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-600 md:hidden" />
                  </div>
                  <span className="text-sm text-zinc-800">{l.contactName}</span>
                  <span className="break-all font-mono text-xs text-zinc-700">{l.email}</span>
                  <span className="text-sm capitalize text-zinc-800">{l.status.replace(/_/g, " ")}</span>
                  <div className="flex items-center justify-end gap-2">
                    <span className="whitespace-nowrap text-sm text-zinc-600">
                      {l.createdAt ? l.createdAt.toLocaleString() : "—"}
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
