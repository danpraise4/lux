"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { customTripSchema } from "@/lib/validators";
import { sendCustomTripEmails } from "@/lib/email/inquiry-mail";
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
  const { travelStart: ts, travelEnd: te, ...rest } = parsed.data;
  const travelStart = ts ? new Date(ts) : undefined;
  const travelEnd = te ? new Date(te) : undefined;

  let travelStartOut = travelStart;
  let travelEndOut = travelEnd;

  if (isDbConfigured()) {
    const conn = await connectDB();
    if (conn) {
      const doc = await CustomTripRequest.create({
        ...rest,
        travelStart,
        travelEnd,
      });
      travelStartOut = doc.travelStart ?? travelStart;
      travelEndOut = doc.travelEnd ?? travelEnd;
    }
  }

  await sendCustomTripEmails({
    ...rest,
    travelStart: travelStartOut,
    travelEnd: travelEndOut,
  });
  revalidatePath("/custom-trip");
  return { ok: true };
}
