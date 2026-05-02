"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import CustomTripRequest from "@/models/CustomTripRequest";
import { sendAdminFollowUpEmail, type SendFollowUpResult } from "@/actions/admin-email";
import { sendCustomTripStatusNotification } from "@/lib/email/inquiry-mail";

const statuses = ["new", "contacted", "closed"] as const;

export async function updateCustomTripRequestFromForm(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const id = String(formData.get("requestId") || "").trim();
  const statusRaw = formData.get("status");
  const statusStr = typeof statusRaw === "string" ? statusRaw.trim() : "";
  const notifyGuest = formData.get("notifyGuestStatus") === "on";

  if (!id || !mongoose.Types.ObjectId.isValid(id)) return;
  if (!isDbConfigured()) return;
  const conn = await connectDB();
  if (!conn) return;

  const statusParsed = z.enum(statuses).safeParse(statusStr);
  if (!statusParsed.success) return;

  const doc = await CustomTripRequest.findById(id).lean();
  if (!doc) return;

  const previousStatus = doc.status;
  if (previousStatus === statusParsed.data) {
    revalidatePath("/admin/custom-trips");
    revalidatePath(`/admin/custom-trips/${id}`);
    return;
  }

  await CustomTripRequest.updateOne({ _id: id }, { $set: { status: statusParsed.data } });

  if (notifyGuest && doc.email) {
    await sendCustomTripStatusNotification({
      email: doc.email,
      name: doc.name,
      status: statusParsed.data,
    });
  }

  revalidatePath("/admin/custom-trips");
  revalidatePath(`/admin/custom-trips/${id}`);
  revalidatePath("/admin/crm");
  revalidatePath("/admin");
}

const replySchema = z.object({
  requestId: z.string().min(1),
  subject: z.string().min(2).max(200),
  body: z.string().min(10).max(20000),
});

export async function sendCustomTripRequestReply(raw: unknown): Promise<SendFollowUpResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, error: "Sign in required" };
  }

  const parsed = replySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Check subject and message (minimum length)." };
  }

  const { requestId, subject, body } = parsed.data;
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return { ok: false, error: "Invalid request." };
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

  const row = await CustomTripRequest.findById(requestId).select("email").lean();
  if (!row?.email) {
    return { ok: false, error: "Request not found." };
  }

  const result = await sendAdminFollowUpEmail({
    to: [row.email],
    subject,
    body,
  });

  if (result.ok) {
    revalidatePath("/admin/custom-trips");
    revalidatePath(`/admin/custom-trips/${requestId}`);
  }

  return result;
}
