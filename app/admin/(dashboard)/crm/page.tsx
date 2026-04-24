import { isDbConfigured, connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export default async function AdminCrmPage() {
  let count = 0;
  if (isDbConfigured()) {
    const c = await connectDB();
    if (c) count = await User.countDocuments();
  }
  return (
    <div>
      <h1 className="font-serif text-2xl">Customer CRM</h1>
      <p className="text-sm text-zinc-600">Extend the `User` model as you onboard members; {count} profile(s) stored.</p>
    </div>
  );
}
