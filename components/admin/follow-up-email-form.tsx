"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendAdminFollowUpEmail } from "@/actions/admin-email";
import type { SendFollowUpResult } from "@/actions/admin-email";

export function FollowUpEmailForm() {
  const [state, setState] = useState<SendFollowUpResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const rawTo = String(fd.get("to") || "");
    const to = rawTo
      .split(/[\s,;]+/)
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean);
    const subject = String(fd.get("subject") || "");
    const body = String(fd.get("body") || "");
    const res = await sendAdminFollowUpEmail({ to, subject, body });
    setLoading(false);
    setState(res);
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 max-w-2xl space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
      <div>
        <Label htmlFor="to">Recipients (comma / space separated)</Label>
        <Input
          id="to"
          name="to"
          required
          className="mt-1 font-mono text-sm"
          placeholder="guest@email.com, lead@company.com"
        />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required maxLength={200} className="mt-1" placeholder="Your trip confirmation" />
      </div>
      <div>
        <Label htmlFor="body">Message</Label>
        <Textarea id="body" name="body" required rows={12} className="mt-1" placeholder={sampleBody} />
      </div>
      {state && (
        <p role="alert" className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`}>
          {state.ok ? state.message : state.error}
        </p>
      )}
      <Button type="submit" variant="default" disabled={loading}>
        {loading ? "Sending…" : "Send follow-up"}
      </Button>
    </form>
  );
}

const sampleBody = `Hi,

Thank you for travelling with N. M. A Luxe. Here is a quick follow-up …

Warm regards,
The travel desk`;
