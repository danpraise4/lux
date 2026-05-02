"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { Country } from "country-state-city";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import SupportedLocation, { formatLocationLabel } from "@/models/SupportedLocation";

const addSchema = z.object({
  countryIso: z.string().length(2),
  region: z.string().min(2).max(120),
});

export type LocationActionState = { ok: true; message?: string } | { ok: false; error: string };

export async function addSupportedLocation(_prev: LocationActionState | null, formData: FormData): Promise<LocationActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in required" };
  if (!isDbConfigured()) {
    return { ok: false, error: "Saving isn’t available right now." };
  }
  const parsed = addSchema.safeParse({
    countryIso: String(formData.get("countryIso") || "").trim().toUpperCase(),
    region: String(formData.get("region") || "").trim(),
  });
  if (!parsed.success) {
    return { ok: false, error: "Select a country and state or region." };
  }
  const countryMeta = Country.getCountryByCode(parsed.data.countryIso);
  if (!countryMeta) {
    return { ok: false, error: "Invalid country." };
  }
  const conn = await connectDB();
  if (!conn) return { ok: false, error: "Something went wrong." };
  try {
    const count = await SupportedLocation.countDocuments();
    await SupportedLocation.create({
      country: countryMeta.name,
      region: parsed.data.region,
      order: count,
    });
  } catch {
    return { ok: false, error: "That combination may already exist." };
  }
  revalidatePath("/admin/locations");
  revalidatePath("/admin/packages/new");
  return { ok: true, message: "Added." };
}

export async function removeSupportedLocation(id: string): Promise<LocationActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Sign in required" };
  if (!id || !isDbConfigured()) return { ok: false, error: "Could not remove." };
  const conn = await connectDB();
  if (!conn) return { ok: false, error: "Something went wrong." };
  await SupportedLocation.findByIdAndDelete(id);
  revalidatePath("/admin/locations");
  revalidatePath("/admin/packages/new");
  return { ok: true, message: "Removed." };
}

export async function listSupportedLocationsForAdmin(): Promise<
  { id: string; label: string; country: string; region: string }[]
> {
  if (!isDbConfigured()) return [];
  const conn = await connectDB();
  if (!conn) return [];
  const list = await SupportedLocation.find().sort({ country: 1, region: 1 }).lean();
  return list.map((l) => ({
    id: String(l._id),
    country: l.country,
    region: l.region,
    label: formatLocationLabel(l),
  }));
}
