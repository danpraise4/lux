"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import CorporateLead from "@/models/CorporateLead";
import { sendAdminFollowUpEmail, type SendFollowUpResult } from "@/actions/admin-email";
import { sendCorporateStatusNotification } from "@/lib/email/inquiry-mail";

const statuses = ["new", "in_review", "won", "closed"] as const;

export async function updateCorporateLeadStatusFromForm(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const id = String(formData.get("leadId") || "").trim();
  const statusRaw = formData.get("status");
  const statusStr = typeof statusRaw === "string" ? statusRaw.trim() : "";
  const notifyGuest = formData.get("notifyGuestStatus") === "on";

  if (!id || !mongoose.Types.ObjectId.isValid(id)) return;
  if (!isDbConfigured()) return;
  const conn = await connectDB();
  if (!conn) return;

  const statusParsed = z.enum(statuses).safeParse(statusStr);
  if (!statusParsed.success) return;

  const lead = await CorporateLead.findById(id).lean();
  if (!lead) return;

  const previousStatus = lead.status;
  if (previousStatus === statusParsed.data) {
    revalidatePath("/admin/corporate");
    revalidatePath(`/admin/corporate/${id}`);
    return;
  }

  await CorporateLead.updateOne({ _id: id }, { $set: { status: statusParsed.data } });

  if (notifyGuest && lead.email) {
    await sendCorporateStatusNotification({
      email: lead.email,
      contactName: lead.contactName,
      company: lead.company,
      status: statusParsed.data,
    });
  }

  revalidatePath("/admin/corporate");
  revalidatePath(`/admin/corporate/${id}`);
  revalidatePath("/admin/crm");
  revalidatePath("/admin");
}

const replySchema = z.object({
  leadId: z.string().min(1),
  subject: z.string().min(2).max(200),
  body: z.string().min(10).max(20000),
});

/** Sends a reply to the lead’s work email (address taken from the database, not the client). */
export async function sendCorporateLeadReply(raw: unknown): Promise<SendFollowUpResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, error: "Sign in required" };
  }

  const parsed = replySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Check subject and message (minimum length)." };
  }

  const { leadId, subject, body } = parsed.data;
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    return { ok: false, error: "Invalid lead." };
  }

  if (!isDbConfigured()) {
    return {
      ok: false,
      error: "This isn’t available right now. Try again later or ask your administrator.",
    };
  }

  const conn = await connectDB();
  if (!conn) {
    return { ok: false, error: "Something went wrong. Try again in a moment." };
  }

  const lead = await CorporateLead.findById(leadId).select("email").lean();
  if (!lead?.email) {
    return { ok: false, error: "Lead not found." };
  }

  const result = await sendAdminFollowUpEmail({
    to: [lead.email],
    subject,
    body,
  });

  if (result.ok) {
    revalidatePath("/admin/corporate");
    revalidatePath(`/admin/corporate/${leadId}`);
  }

  return result;
}
