export default function AdminBookingsLoading() {
  return (
    <div className="min-w-0 animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-md bg-zinc-200" />
        <div className="h-4 w-full max-w-xl rounded-md bg-zinc-100" />
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="grid grid-cols-6 gap-4 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-zinc-200" />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-zinc-50 px-4 py-4 last:border-0">
            <div className="h-4 flex-1 rounded bg-zinc-100" />
            <div className="h-4 w-24 rounded bg-zinc-100" />
            <div className="h-4 w-20 rounded bg-zinc-100" />
            <div className="h-4 w-28 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
