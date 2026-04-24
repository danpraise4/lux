"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitCustomTrip } from "@/actions/custom-trip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full rounded-full sm:w-auto" type="submit" size="lg" variant="gold" disabled={pending}>
      {pending ? "Sending…" : "Submit request"}
    </Button>
  );
}

export function CustomTripForm() {
  const [state, formAction] = useFormState(submitCustomTrip, { ok: false });
  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 text-sm text-ink">
        <p className="font-serif text-xl">Request received.</p>
        <p className="mt-2 text-muted">Our team will contact you with a tailored outline — usually within one business day.</p>
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="destination">Destination interest</Label>
          <Input id="destination" name="destination" className="mt-1" placeholder="Jos, Ghana, or open brief" />
        </div>
        <div>
          <Label htmlFor="budget">Budget range (optional)</Label>
          <Input id="budget" name="budget" className="mt-1" placeholder="e.g. ₦400k – ₦800k" />
        </div>
        <div>
          <Label htmlFor="numTravelers">Number of travelers</Label>
          <Input id="numTravelers" name="numTravelers" type="number" min={1} defaultValue={2} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="travelStart">Start date</Label>
          <Input id="travelStart" name="travelStart" type="date" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="travelEnd">End date</Label>
          <Input id="travelEnd" name="travelEnd" type="date" className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="dietary">Dietary preferences</Label>
        <Input id="dietary" name="dietary" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="activityLevel">Activity level</Label>
        <select
          id="activityLevel"
          name="activityLevel"
          className="mt-1 w-full min-w-0 rounded-md border border-border bg-surface p-2.5 text-base md:p-2 md:text-sm"
          defaultValue="moderate"
        >
          <option value="low">Unhurried</option>
          <option value="moderate">Balanced</option>
          <option value="high">Energetic</option>
        </select>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" className="mt-1" rows={4} />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Submit />
    </form>
  );
}
