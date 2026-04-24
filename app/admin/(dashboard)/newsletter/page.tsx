import { isDbConfigured, connectDB } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export default async function AdminNewsletterPage() {
  let emails: { email: string; createdAt: Date }[] = [];
  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) {
      const list = await Newsletter.find().sort({ createdAt: -1 }).limit(100).lean();
      emails = list.map((n) => ({ email: n.email, createdAt: n.createdAt }));
    }
  }
  return (
    <div>
      <h1 className="font-serif text-2xl">Newsletter</h1>
      <ul className="mt-4 max-h-96 overflow-auto text-sm text-zinc-700">
        {emails.length ? (
          emails.map((e) => (
            <li key={e.email} className="border-b border-zinc-100 py-1">
              {e.email} <span className="text-zinc-400">{e.createdAt.toLocaleDateString()}</span>
            </li>
          ))
        ) : (
          <li className="text-zinc-500">No signups in DB (or MONGODB_URI missing).</li>
        )}
      </ul>
    </div>
  );
}
