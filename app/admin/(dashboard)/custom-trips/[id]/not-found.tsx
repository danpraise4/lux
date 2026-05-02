import Link from "next/link";

export default function CustomTripNotFound() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-zinc-600">This custom trip request was not found.</p>
      <Link href="/admin/custom-trips" className="mt-4 inline-block text-sm font-medium text-gold underline">
        Back to custom trip requests
      </Link>
    </div>
  );
}
