import { isDbConfigured, connectDB } from "@/lib/mongodb";
import CorporateLead from "@/models/CorporateLead";

export default async function AdminCorporatePage() {
  let leads: { company: string; contactName: string; email: string; status: string }[] = [];
  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) {
      const list = await CorporateLead.find().sort({ createdAt: -1 }).limit(50).lean();
      leads = list.map((l) => ({ company: l.company, contactName: l.contactName, email: l.email, status: l.status }));
    }
  }
  return (
    <div>
      <h1 className="font-serif text-2xl">Corporate requests</h1>
      <div className="mt-6 space-y-2">
        {leads.length ? (
          leads.map((l) => (
            <div key={l.email + l.company} className="rounded-lg border border-zinc-200 bg-white p-3 text-sm">
              <p className="font-medium">{l.company}</p>
              <p className="text-zinc-600">
                {l.contactName} · {l.email} — {l.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-600">No corporate enquiries yet.</p>
        )}
      </div>
    </div>
  );
}
