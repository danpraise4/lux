"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { sendCustomTripRequestReply, updateCustomTripRequestFromForm } from "@/actions/custom-trip-admin";
import type { SendFollowUpResult } from "@/actions/admin-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const statuses = ["new", "contacted", "closed"] as const;

function StatusSubmit({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gold" size="sm" disabled={pending} className="min-w-28">
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function CustomTripRequestStatusForm({ requestId, defaultStatus }: { requestId: string; defaultStatus: string }) {
  return (
    <form action={updateCustomTripRequestFromForm} className="space-y-4">
      <input type="hidden" name="requestId" value={requestId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Status</span>
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
        <StatusSubmit label="Save status" pendingLabel="Saving…" />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" name="notifyGuestStatus" defaultChecked className="size-4 rounded border-zinc-300" />
        Email guest a short update when status changes
      </label>
    </form>
  );
}

export function CustomTripReplyForm({
  requestId,
  guestEmail,
  defaultSubject,
  guestFirstName,
}: {
  requestId: string;
  guestEmail: string;
  defaultSubject: string;
  guestFirstName: string;
}) {
  const [state, setState] = useState<SendFollowUpResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const subject = String(fd.get("subject") || "");
    const body = String(fd.get("body") || "");
    const res = await sendCustomTripRequestReply({ requestId, subject, body });
    setLoading(false);
    setState(res);
  }

  const sample = `Hi ${guestFirstName},

Thanks for your bespoke trip brief — here's a quick update from our travel desk.

`;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label>To</Label>
        <Input readOnly value={guestEmail} className="mt-1 font-mono text-sm" />
        <p className="mt-1 text-xs text-zinc-500">Recipient is taken from this saved request.</p>
      </div>
      <div>
        <Label htmlFor={`ct-subject-${requestId}`}>Subject</Label>
        <Input
          id={`ct-subject-${requestId}`}
          name="subject"
          required
          maxLength={200}
          defaultValue={defaultSubject}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`ct-body-${requestId}`}>Message</Label>
        <Textarea id={`ct-body-${requestId}`} name="body" required rows={12} className="mt-1" defaultValue={sample} />
      </div>
      {state && (
        <p role="alert" className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>
          {state.ok ? state.message : state.error}
        </p>
      )}
      <Button type="submit" variant="default" disabled={loading}>
        {loading ? "Sending…" : "Send email"}
      </Button>
    </form>
  );
}
