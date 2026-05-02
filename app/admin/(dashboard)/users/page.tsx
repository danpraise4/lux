import Link from "next/link";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Booking from "@/models/Booking";
import Newsletter from "@/models/Newsletter";
import User from "@/models/User";

export default async function AdminUsersPage() {
  let newsletters: { email: string; createdAt: Date }[] = [];
  let guests: { id: string; leadName: string; leadEmail: string; leadPhone: string; updatedAt?: Date | null }[] = [];
  let profiles: { name: string; email: string; phone?: string }[] = [];
  let staff: { email: string; name: string }[] = [];

  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) {
      newsletters = (
        await Newsletter.find().sort({ createdAt: -1 }).limit(80).select("email createdAt").lean()
      ).map((n: { email: string; createdAt: Date }) => ({ email: n.email, createdAt: n.createdAt }));

      const bookings = await Booking.find()
        .sort({ updatedAt: -1 })
        .limit(50)
        .select("_id leadName leadEmail leadPhone updatedAt")
        .lean();

      guests = bookings.map((b: { _id: { toString(): string }; leadName: string; leadEmail: string; leadPhone: string; updatedAt?: Date }) => ({
        id: b._id.toString(),
        leadName: b.leadName,
        leadEmail: b.leadEmail,
        leadPhone: b.leadPhone,
        updatedAt: b.updatedAt,
      }));

      const rawProfiles = await User.find().sort({ updatedAt: -1 }).limit(50).select("name email phone").lean();
      profiles = rawProfiles.map((u) => ({
        name: u.name,
        email: u.email,
        phone: u.phone ?? "",
      }));

      staff = (
        await Admin.find().sort({ updatedAt: -1 }).limit(40).select("email name").lean()
      ).map((a: { email: string; name: string }) => ({ email: a.email, name: a.name }));
    }
  }

  const guestEmails = [...new Set(guests.map((g) => g.leadEmail.toLowerCase()))];

  return (
    <div className="min-w-0 space-y-10">
      <div>
        <h1 className="font-serif text-2xl">People & subscribers</h1>
        <p className="mt-2 max-w-prose text-sm text-zinc-600">
          Newsletter signups, booking enquiries, and saved guest profiles appear here. Staff sign in from{" "}
          <Link className="text-gold-dark underline" href="/admin/login">
            staff login
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-600">
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
            Newsletter: <strong>{newsletters.length}</strong> recent
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
            Unique booking emails (last 50 rows): <strong>{guestEmails.length}</strong>
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
            CRM profiles: <strong>{profiles.length}</strong>
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
            Admin accounts: <strong>{staff.length}</strong>
          </span>
        </div>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold text-zinc-900">Recent booking leads</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-100">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Last touch</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g.id} className="border-t border-zinc-100">
                  <td className="p-2">{g.leadName}</td>
                  <td className="break-all p-2 font-mono text-xs">{g.leadEmail}</td>
                  <td className="p-2">{g.leadPhone}</td>
                  <td className="whitespace-nowrap p-2 text-zinc-500">
                    {g.updatedAt instanceof Date ? g.updatedAt.toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
              {!guests.length && (
                <tr>
                  <td className="p-4 text-zinc-600" colSpan={4}>
                    No booking leads yet. They appear when guests submit an enquiry or booking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-semibold text-zinc-900">Newsletter list (latest)</h2>
          <ul className="mt-3 max-h-80 divide-y divide-zinc-100 overflow-auto text-sm">
            {newsletters.map((n) => (
              <li key={n.email} className="py-2 font-mono text-xs">
                <span>{n.email}</span>
                <span className="ml-2 text-zinc-400">{n.createdAt.toLocaleDateString()}</span>
              </li>
            ))}
            {!newsletters.length && <li className="py-4 text-zinc-500">No subscribers yet.</li>}
          </ul>
          <Link href="/admin/newsletter" className="mt-4 inline-block text-sm text-gold-dark underline">
            Manage / view all in Newsletter
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-semibold text-zinc-900">Guest profiles</h2>
          <ul className="mt-3 max-h-80 divide-y divide-zinc-100 overflow-auto text-sm">
            {profiles.map((u) => (
              <li key={u.email} className="py-2">
                <p className="font-medium text-zinc-800">{u.name}</p>
                <p className="font-mono text-xs text-zinc-600">{u.email}</p>
                {u.phone ? <p className="text-xs text-zinc-500">{u.phone}</p> : null}
              </li>
            ))}
            {!profiles.length && <li className="py-4 text-zinc-500">No persisted guest profiles.</li>}
          </ul>
          <Link href="/admin/crm" className="mt-4 inline-block text-sm text-gold-dark underline">
            CRM notes
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold text-zinc-900">Administrators</h2>
        <p className="mt-2 text-sm text-zinc-600">
          People who can access this admin area. To add or change an account, ask your website administrator.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {staff.map((s) => (
            <li key={s.email} className="flex flex-wrap items-baseline gap-2 rounded-lg bg-zinc-50 px-3 py-2">
              <span className="font-medium">{s.name}</span>
              <span className="font-mono text-xs text-zinc-600">{s.email}</span>
            </li>
          ))}
          {!staff.length && <li className="text-zinc-600">No administrator accounts listed.</li>}
        </ul>
      </section>
    </div>
  );
}
