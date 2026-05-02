"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";

const selectCls = "mt-1 w-full rounded-md border border-zinc-200 bg-white p-2 text-sm";

export type SavedLocationOption = { id: string; label: string; country: string; region: string };

export function SupportedLocationPairSelect({ locations }: { locations: SavedLocationOption[] }) {
  const countries = useMemo(
    () => [...new Set(locations.map((l) => l.country))].sort((a, b) => a.localeCompare(b)),
    [locations]
  );

  const [country, setCountry] = useState("");

  useEffect(() => {
    if (countries.length === 1) {
      setCountry((prev) => prev || countries[0]);
    }
  }, [countries]);

  const filtered = useMemo(() => locations.filter((l) => l.country === country), [locations, country]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="saved-country">Country</Label>
          <select
            id="saved-country"
            className={selectCls}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select country…</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="saved-region">State / region</Label>
          <select
            id="saved-region"
            name="locationId"
            className={selectCls}
            required
            defaultValue=""
            key={country || "none"}
          >
            <option value="" disabled>
              {country ? "Select state / region…" : "Choose a country first"}
            </option>
            {filtered.map((l) => (
              <option key={l.id} value={l.id}>
                {l.region}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        Manage options under{" "}
        <Link href="/admin/locations" className="text-gold underline">
          Tour locations
        </Link>
        .
      </p>
    </div>
  );
}
