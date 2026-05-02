import Link from "next/link";

export default function CorporateLeadNotFound() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-zinc-600">This corporate enquiry was not found.</p>
      <Link href="/admin/corporate" className="mt-4 inline-block text-sm font-medium text-gold underline">
        Back to corporate requests
      </Link>
    </div>
  );
}
