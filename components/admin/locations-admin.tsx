"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { addSupportedLocation, removeSupportedLocation } from "@/actions/supported-locations";
import { CountryStateSelects } from "@/components/admin/country-state-selects";
import { Button } from "@/components/ui/button";

function AddSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding…" : "Add location"}
    </Button>
  );
}

export type LocationRow = { id: string; label: string; country: string; region: string };

export function LocationsAdmin({ initialLocations }: { initialLocations: LocationRow[] }) {
  const router = useRouter();
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleAdd(formData: FormData) {
    setNotice(null);
    const r = await addSupportedLocation(null, formData);
    if (r.ok) {
      setNotice({ ok: true, text: r.message || "Added." });
      router.refresh();
    } else {
      setNotice({ ok: false, text: r.error });
    }
  }

  async function handleRemove(id: string) {
    setNotice(null);
    const r = await removeSupportedLocation(id);
    if (r.ok) {
      setNotice({ ok: true, text: r.message || "Removed." });
      router.refresh();
    } else {
      setNotice({ ok: false, text: r.error });
    }
  }

  return (
    <div className="space-y-8">
      <form action={handleAdd} className="max-w-md space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
        <p className="text-sm font-medium text-zinc-800">Add country & state / region</p>
        <CountryStateSelects idPrefix="loc-admin" />
        {notice && (
          <p className={`text-sm ${notice.ok ? "text-green-700" : "text-red-600"}`}>{notice.text}</p>
        )}
        <AddSubmit />
      </form>

      <div>
        <p className="text-sm font-medium text-zinc-800">Supported locations</p>
        <p className="mt-1 text-xs text-zinc-500">
          These appear on the new package screen as the tour location dropdown.
        </p>
        <ul className="mt-3 divide-y divide-zinc-100 rounded-lg border border-zinc-200">
          {initialLocations.length === 0 ? (
            <li className="px-3 py-4 text-sm text-zinc-600">None yet — add one above.</li>
          ) : (
            initialLocations.map((loc) => (
              <li key={loc.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <span>{loc.label}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => handleRemove(loc.id)}>
                  Remove
                </Button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
