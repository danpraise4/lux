export default function AdminBookingDetailLoading() {
  return (
    <div className="min-w-0 max-w-3xl animate-pulse space-y-8">
      <div className="h-4 w-32 rounded bg-zinc-200" />
      <div className="space-y-3">
        <div className="h-9 w-2/3 rounded-md bg-zinc-200" />
        <div className="h-4 w-40 rounded bg-zinc-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 rounded-xl bg-zinc-100" />
        <div className="h-32 rounded-xl bg-zinc-100" />
      </div>
      <div className="h-48 rounded-xl bg-zinc-100" />
    </div>
  );
}
