"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createPackage } from "@/actions/admin-package";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Create package"}
    </Button>
  );
}

export function PackageForm() {
  const [state, formAction] = useFormState(createPackage, { ok: false });
  return (
    <form action={formAction} className="space-y-3">
      <div>
        <Label>Title</Label>
        <Input name="title" required className="mt-1" />
      </div>
      <div>
        <Label>Slug (lowercase, hyphens)</Label>
        <Input name="slug" required className="mt-1" placeholder="lagos-long-weekend" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Destination</Label>
          <Input name="destination" required className="mt-1" />
        </div>
        <div>
          <Label>Hub / city</Label>
          <Input name="city" required className="mt-1" />
        </div>
      </div>
      <div>
        <Label>Cover image URL (Cloudinary or HTTPS)</Label>
        <Input name="coverImage" type="url" required className="mt-1" />
      </div>
      <div>
        <Label>Short summary</Label>
        <Textarea name="shortSummary" required className="mt-1" rows={3} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Price from (NGN)</Label>
          <Input name="priceFrom" type="number" min={0} required className="mt-1" />
        </div>
        <div>
          <Label>Duration (days)</Label>
          <Input name="durationDays" type="number" min={1} required className="mt-1" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Group or solo</Label>
          <select name="groupOrSolo" className="mt-1 w-full rounded-md border p-2 text-sm" defaultValue="both">
            <option value="both">Both</option>
            <option value="group">Group</option>
            <option value="solo">Solo</option>
          </select>
        </div>
        <div>
          <Label>Vibe</Label>
          <select name="vibe" className="mt-1 w-full rounded-md border p-2 text-sm" defaultValue="mixed">
            <option value="mixed">Mixed</option>
            <option value="adventure">Adventure</option>
            <option value="relaxation">Relaxation</option>
            <option value="cultural">Cultural</option>
          </select>
        </div>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Submit />
    </form>
  );
}
