import Link from "next/link";
import { fetchPackages } from "@/lib/data/packages";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function AdminPackagesPage() {
  const list = await fetchPackages();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl">Packages</h1>
        <Button asChild className="rounded-md" size="sm" variant="default">
          <Link href="/admin/packages/new">New package</Link>
        </Button>
      </div>
      <p className="text-sm text-zinc-600">List merges MongoDB with demo seed when the database is empty or unavailable.</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">City</th>
              <th className="p-3">From</th>
              <th className="p-3">Days</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.slug} className="border-b border-zinc-100 last:border-0">
                <td className="p-3">
                  <Link className="text-gold-dark underline" href={"/packages/" + p.slug} target="_blank" rel="noreferrer">
                    {p.title}
                  </Link>
                </td>
                <td className="p-3 text-zinc-600">{p.city}</td>
                <td className="p-3">{formatNaira(p.priceFrom)}</td>
                <td className="p-3">{p.durationDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
