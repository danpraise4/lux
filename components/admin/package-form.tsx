"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createPackage } from "@/actions/admin-package";
import { CountryStateSelects } from "@/components/admin/country-state-selects";
import { SupportedLocationPairSelect } from "@/components/admin/supported-location-pair-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoverImageInput } from "@/components/admin/cover-image-input";
import { slugify } from "@/lib/utils";
function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Create package"}
    </Button>
  );
}

export type PackageLocationOption = { id: string; label: string; country: string; region: string };

export function PackageForm({ locations = [] }: { locations?: PackageLocationOption[] }) {
  const [state, formAction] = useFormState(createPackage, { ok: false });
  const hasLocations = locations.length > 0;
  const [title, setTitle] = useState("");
  const slug = useMemo(() => slugify(title), [title]);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <Label htmlFor="pkg-title">Title</Label>
        <Input
          id="pkg-title"
          name="title"
          required
          minLength={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
        <input type="hidden" name="slug" value={slug} />
        <p className="mt-1 text-xs text-zinc-500">
          URL slug: <span className="font-mono text-zinc-700">{slug || "…"}</span>
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-800">Tour location</p>
        {hasLocations ? (
          <div className="mt-2">
            <SupportedLocationPairSelect locations={locations} />
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              No saved tour locations yet. Pick a country and state below, or add curated pairs under{" "}
              <Link href="/admin/locations" className="font-medium underline">
                Tour locations
              </Link>
              .
            </p>
            <CountryStateSelects idPrefix="pkg-new" />
          </div>
        )}
      </div>
      <CoverImageInput />
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
