"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { newsletterSchema } from "@/lib/validators";
import Newsletter from "@/models/Newsletter";

export async function newsletterSubscribe(
  _prev: unknown,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const email = String(formData.get("email") || "");
  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) {
    return { ok: false, error: "Valid email required" };
  }
  if (!isDbConfigured()) {
    revalidatePath("/");
    return { ok: true };
  }
  try {
    const conn = await connectDB();
    if (!conn) {
      revalidatePath("/");
      return { ok: true };
    }
    await Newsletter.create({ email: parsed.data.email });
  } catch {
    // duplicate or network — still return ok to avoid leaking info
  }
  revalidatePath("/");
  return { ok: true };
}
