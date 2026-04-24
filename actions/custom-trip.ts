"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { customTripSchema } from "@/lib/validators";
import CustomTripRequest from "@/models/CustomTripRequest";

export async function submitCustomTrip(
  _prev: unknown,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const raw = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    destination: String(formData.get("destination") || ""),
    budget: String(formData.get("budget") || ""),
    travelStart: String(formData.get("travelStart") || ""),
    travelEnd: String(formData.get("travelEnd") || ""),
    numTravelers: String(formData.get("numTravelers") || "1"),
    dietary: String(formData.get("dietary") || ""),
    activityLevel: String(formData.get("activityLevel") || "moderate"),
    notes: String(formData.get("notes") || ""),
  };
  const parsed = customTripSchema.safeParse({
    ...raw,
    numTravelers: Number(raw.numTravelers),
    travelStart: raw.travelStart || undefined,
    travelEnd: raw.travelEnd || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: "Check required fields" };
  }
  const { travelStart, travelEnd, ...rest } = parsed.data;
  if (!isDbConfigured()) {
    revalidatePath("/custom-trip");
    return { ok: true };
  }
  const conn = await connectDB();
  if (!conn) {
    revalidatePath("/custom-trip");
    return { ok: true };
  }
  await CustomTripRequest.create({
    ...rest,
    travelStart: travelStart ? new Date(travelStart) : undefined,
    travelEnd: travelEnd ? new Date(travelEnd) : undefined,
  });
  revalidatePath("/custom-trip");
  return { ok: true };
}
