"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { corporateLeadSchema } from "@/lib/validators";
import { sendCorporateLeadEmails } from "@/lib/email/inquiry-mail";
import CorporateLead from "@/models/CorporateLead";

export async function submitCorporateProposal(
  _prev: unknown,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const raw = {
    company: String(formData.get("company") || ""),
    contactName: String(formData.get("contactName") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    message: String(formData.get("message") || ""),
    teamSize: String(formData.get("teamSize") || ""),
  };
  const parsed = corporateLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Check required fields" };
  }
  if (isDbConfigured()) {
    const conn = await connectDB();
    if (conn) {
      await CorporateLead.create(parsed.data);
    }
  }
  await sendCorporateLeadEmails(parsed.data);
  revalidatePath("/corporate-travel");
  return { ok: true };
}
