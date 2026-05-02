import Link from "next/link";

export default function BookingNotFound() {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="font-serif text-2xl text-zinc-900">Booking not found</h1>
      <p className="mt-3 text-sm text-zinc-600">That booking may have been removed or the link is incorrect.</p>
      <Link href="/admin/bookings" className="mt-6 inline-block text-sm font-medium text-gold underline">
        Back to all bookings
      </Link>
    </div>
  );
}
