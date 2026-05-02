"use client";

import { useFormStatus } from "react-dom";
import {
  adjustBookingPricingFromForm,
  markBalancePaidFromForm,
  updateBookingFromForm,
} from "@/actions/admin-bookings";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const statuses = ["inquiry", "pending_deposit", "confirmed", "balance_due", "paid", "cancelled"] as const;

function SubmitButton({
  label,
  pendingLabel,
  variant = "default",
}: {
  label: string;
  pendingLabel: string;
  variant?: "default" | "outline" | "gold";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} size="sm" disabled={pending} className="min-w-28">
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function BookingStatusForm({ bookingId, defaultStatus }: { bookingId: string; defaultStatus: string }) {
  return (
    <form action={updateBookingFromForm} className="space-y-4">
      <input type="hidden" name="bookingId" value={bookingId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Booking status</span>
          <select
            name="status"
            defaultValue={defaultStatus}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
        <SubmitButton label="Save status" pendingLabel="Saving…" variant="gold" />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" name="notifyGuestStatus" defaultChecked className="size-4 rounded border-zinc-300" />
        Email guest when status changes
      </label>
    </form>
  );
}

export function BookingPricingForm({
  bookingId,
  defaultPriceTotal,
  defaultPricingNote,
}: {
  bookingId: string;
  defaultPriceTotal: number;
  defaultPricingNote: string;
}) {
  return (
    <form action={adjustBookingPricingFromForm} className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
      <input type="hidden" name="bookingId" value={bookingId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Trip total (NGN)</span>
          <input
            name="priceTotal"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={defaultPriceTotal}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm shadow-sm"
          />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Note to guest (optional)</span>
          <Textarea
            name="pricingNote"
            rows={3}
            placeholder="Shown in the email when you notify them — e.g. transfers added."
            defaultValue={defaultPricingNote}
            className="resize-y bg-white text-sm"
          />
        </label>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" name="notifyGuest" defaultChecked className="size-4 rounded border-zinc-300" />
        Email guest with updated quote &amp; payment link
      </label>
      <SubmitButton label="Save & notify" pendingLabel="Saving…" variant="gold" />
    </form>
  );
}

function MarkSettledSubmit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" size="sm" disabled={disabled || pending} className="min-w-40">
      {pending ? "Updating…" : "Mark balance settled"}
    </Button>
  );
}

export function MarkSettledForm({ bookingId, disabled }: { bookingId: string; disabled: boolean }) {
  return (
    <form action={markBalancePaidFromForm} className="inline-flex flex-col gap-1">
      <input type="hidden" name="bookingId" value={bookingId} />
      <MarkSettledSubmit disabled={disabled} />
      <p className="max-w-xs text-xs text-zinc-500">
        Use only after you&apos;ve confirmed funds outside the gateway (cash, transfer, etc.).
      </p>
    </form>
  );
}
