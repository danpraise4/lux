import Link from "next/link";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import CorporateLead from "@/models/CorporateLead";
import CustomTripRequest from "@/models/CustomTripRequest";
import User from "@/models/User";

export default async function AdminCrmPage() {
  let customLatest: Array<{
    id: string;
    name: string;
    email: string;
    destination: string;
    status: string;
    createdAt?: Date | null;
  }> = [];
  let corpLatest: Array<{
    id: string;
    company: string;
    contactName: string;
    email: string;
    status: string;
    createdAt?: Date | null;
  }> = [];
  let profiles = 0;
  let newCustom = 0;
  let newCorp = 0;

  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) {
      profiles = await User.countDocuments();
      newCustom = await CustomTripRequest.countDocuments({ status: "new" });
      newCorp = await CorporateLead.countDocuments({ status: { $in: ["new", "in_review"] } });

      const trips = await CustomTripRequest.find().sort({ createdAt: -1 }).limit(25).lean();
      customLatest = trips.map((t) => ({
        id: String(t._id),
        name: t.name,
        email: t.email,
        destination: t.destination || "",
        status: t.status,
        createdAt: t.createdAt ?? null,
      }));

      const corps = await CorporateLead.find().sort({ createdAt: -1 }).limit(25).lean();
      corpLatest = corps.map((l) => ({
        id: String(l._id),
        company: l.company,
        contactName: l.contactName,
        email: l.email,
        status: l.status,
        createdAt: l.createdAt ?? null,
      }));
    }
  }

  return (
    <div className="min-w-0 space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-serif text-2xl">CRM inbox</h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            Briefs landed from{" "}
            <Link href="/custom-trip" className="text-gold-dark underline">
              bespoke requests
            </Link>{" "}
            &amp;{" "}
            <Link href="/corporate-travel" className="text-gold-dark underline">
              corporate enquiries
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-950">New bespoke: {newCustom}</span>
          <span className="rounded-full bg-sky-100 px-3 py-1 font-semibold text-sky-950">Corporate pipelines: {newCorp}</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-800">Stored profiles: {profiles}</span>
        </div>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">Latest custom-trip requests</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-100">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="p-3">Guest</th>
                <th className="p-3">Email</th>
                <th className="p-3">Focus</th>
                <th className="p-3">Status</th>
                <th className="p-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {customLatest.map((row) => (
                <tr key={row.id} className="border-b border-zinc-50 align-top">
                  <td className="p-3">{row.name}</td>
                  <td className="break-all p-3 font-mono text-xs">{row.email}</td>
                  <td className="p-3">{row.destination || "—"}</td>
                  <td className="p-3 capitalize">{row.status}</td>
                  <td className="whitespace-nowrap p-3 text-zinc-600">{row.createdAt ? row.createdAt.toLocaleString() : "—"}</td>
                </tr>
              ))}
              {!customLatest.length && (
                <tr>
                  <td className="p-6 text-zinc-500" colSpan={5}>
                    No inbound briefs logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-900">Latest corporate enquiries</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-100">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="p-3">Organisation</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Email</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {corpLatest.map((row) => (
                <tr key={row.id} className="border-b border-zinc-50 align-top">
                  <td className="p-3">{row.company}</td>
                  <td className="p-3">{row.contactName}</td>
                  <td className="break-all p-3 font-mono text-xs">{row.email}</td>
                  <td className="p-3 capitalize">{row.status.replace(/_/g, " ")}</td>
                  <td className="whitespace-nowrap p-3 text-zinc-600">{row.createdAt ? row.createdAt.toLocaleString() : "—"}</td>
                </tr>
              ))}
              {!corpLatest.length && (
                <tr>
                  <td className="p-6 text-zinc-500" colSpan={5}>
                    No corporate leads saved.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-zinc-600">
        To change a lead’s stage, follow up by email or contact your administrator if you need changes in the system.
      </p>
    </div>
  );
}
