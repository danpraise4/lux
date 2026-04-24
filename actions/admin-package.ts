"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { packageFormSchema } from "@/lib/validators";
import Package from "@/models/Package";

export async function createPackage(_p: unknown, formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!isDbConfigured()) {
    return { ok: false, error: "Database not configured" };
  }
  const raw = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    destination: String(formData.get("destination") || ""),
    city: String(formData.get("city") || ""),
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
  const conn = await connectDB();
  if (!conn) {
    return { ok: false, error: "Could not connect" };
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
