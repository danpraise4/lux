"use client";

import { useMemo, useState } from "react";
import { Country, State } from "country-state-city";
import { Label } from "@/components/ui/label";

const selectCls = "mt-1 w-full rounded-md border border-zinc-200 bg-white p-2 text-sm";

export type CountryStateSelectsProps = {
  /** Form field for ISO 3166-1 alpha-2 country code */
  countryFieldName?: string;
  /** Form field for state/region display name */
  regionFieldName?: string;
  idPrefix?: string;
};

export function CountryStateSelects({
  countryFieldName = "countryIso",
  regionFieldName = "region",
  idPrefix = "geo",
}: CountryStateSelectsProps) {
  const countries = useMemo(
    () => Country.getAllCountries().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const [countryIso, setCountryIso] = useState("");

  const states = useMemo(() => {
    if (!countryIso) return [];
    return State.getStatesOfCountry(countryIso).sort((a, b) => a.name.localeCompare(b.name));
  }, [countryIso]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label htmlFor={`${idPrefix}-country`}>Country</Label>
        <select
          id={`${idPrefix}-country`}
          name={countryFieldName}
          required
          className={selectCls}
          value={countryIso}
          onChange={(e) => setCountryIso(e.target.value)}
        >
          <option value="">Select country…</option>
          {countries.map((c) => (
            <option key={c.isoCode} value={c.isoCode}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-region`}>State or region</Label>
        <select
          id={`${idPrefix}-region`}
          key={countryIso || "none"}
          name={regionFieldName}
          required
          className={selectCls}
          defaultValue=""
        >
          <option value="" disabled>
            {countryIso ? "Select state / region…" : "Choose a country first"}
          </option>
          {states.map((s) => (
            <option key={`${s.isoCode}-${s.countryCode}`} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
