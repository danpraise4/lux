"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Country } from "country-state-city";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { packageFormSchema } from "@/lib/validators";
import Package from "@/models/Package";
import SupportedLocation, { formatLocationLabel } from "@/models/SupportedLocation";

export async function createPackage(_p: unknown, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!isDbConfigured()) {
    return { ok: false, error: "Saving isn’t available right now. Try again later or ask your administrator." };
  }
  const conn = await connectDB();
  if (!conn) {
    return { ok: false, error: "Something went wrong. Try again in a moment." };
  }

  const locationId = String(formData.get("locationId") || "").trim();
  const locCount = await SupportedLocation.countDocuments();

  let destination = "";
  let city = "";

  if (locationId) {
    const loc = await SupportedLocation.findById(locationId).lean();
    if (!loc) {
      return { ok: false, error: "Choose a valid location from the list." };
    }
    destination = formatLocationLabel(loc);
    city = loc.region;
  } else if (locCount > 0) {
    return { ok: false, error: "Select a country and state / region for this tour." };
  } else {
    const countryIso = String(formData.get("countryIso") || "").trim().toUpperCase();
    const region = String(formData.get("region") || "").trim();
    if (!countryIso || !region) {
      return { ok: false, error: "Select a country and state / region." };
    }
    const countryMeta = Country.getCountryByCode(countryIso);
    if (!countryMeta) {
      return { ok: false, error: "Choose a valid country." };
    }
    destination = `${region}, ${countryMeta.name}`;
    city = region;
  }

  const raw = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    destination,
    city,
    coverImage: String(formData.get("coverImage") || ""),
    shortSummary: String(formData.get("shortSummary") || ""),
    priceFrom: String(formData.get("priceFrom") || "0"),
    durationDays: String(formData.get("durationDays") || "1"),
    groupOrSolo: String(formData.get("groupOrSolo") || "both"),
    vibe: String(formData.get("vibe") || "mixed"),
  };
  const parsed = packageFormSchema.safeParse({
    ...raw,
    priceFrom: Number(raw.priceFrom),
    durationDays: Number(raw.durationDays),
  });
  if (!parsed.success) {
    return { ok: false, error: "Check all fields" };
  }
  try {
    await Package.create({ ...parsed.data, featured: false, included: [], excluded: [], itinerary: [], faqs: [], gallery: [] });
  } catch {
    return { ok: false, error: "Slug may already exist" };
  }
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  redirect("/admin/packages");
}
