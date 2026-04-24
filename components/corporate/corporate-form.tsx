"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitCorporateProposal } from "@/actions/corporate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full rounded-full sm:w-auto" type="submit" size="lg" variant="gold" disabled={pending}>
      {pending ? "Sending…" : "Request proposal"}
    </Button>
  );
}

export function CorporateForm() {
  const [state, formAction] = useFormState(submitCorporateProposal, { ok: false });
  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 text-sm">
        <p className="font-serif text-xl text-ink">We&apos;re on it.</p>
        <p className="mt-2 text-muted">Expect a call or email to align on scope, travel policy, and budget bands.</p>
      </div>
    );
  }
  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="contactName">Contact name</Label>
        <Input id="contactName" name="contactName" required className="mt-1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="teamSize">Approx. team / travellers</Label>
        <Input id="teamSize" name="teamSize" className="mt-1" placeholder="e.g. 25 staff + 2 execs" />
      </div>
      <div>
        <Label htmlFor="message">Context</Label>
        <Textarea
          id="message"
          name="message"
          className="mt-1"
          rows={4}
          placeholder="Travel corridors, event dates, policy notes…"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Submit />
    </form>
  );
}
