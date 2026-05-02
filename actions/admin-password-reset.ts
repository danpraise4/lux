"use server";

import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSiteOrigin } from "@/lib/site-origin";
import { sendSystemTransactionalEmail } from "@/lib/send-system-email";
import { adminPasswordResetEmail } from "@/lib/email/templates";

export type ResetRequestState =
  | { ok: true; message: string }
  | { ok: false; error?: string };

const emailSchema = z.string().trim().email();
const pwdSchema = z.string().min(8).max(200);

function hashResetToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/**
 * Starts password recovery. Same response whether the email exists (security).
 * Dev-only accounts (ADMIN_DEV_EMAIL) are unaffected — no DB row to update.
 */
export async function requestAdminPasswordReset(prev: ResetRequestState | null, formData: FormData): Promise<ResetRequestState> {
  void prev;
  const emailRaw = String(formData.get("email") || "");
  const parsed = emailSchema.safeParse(emailRaw);
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const email = parsed.data.toLowerCase();

  const genericOk: ResetRequestState = {
    ok: true,
    message:
      "If that address belongs to a staff account, we sent a reset link (check spam). The link expires in one hour.",
  };

  if (!isDbConfigured()) {
    return genericOk;
  }
  const conn = await connectDB();
  if (!conn) return genericOk;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return genericOk;
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await Admin.updateOne(
    { _id: admin._id },
    { $set: { resetTokenHash: tokenHash, resetTokenExpires: expires } }
  );

  const origin = getServerSiteOrigin();
  const link = `${origin}/admin/reset-password?token=${encodeURIComponent(token)}`;

  const styled = adminPasswordResetEmail({
    recipientName: admin.name || "there",
    resetLink: link,
  });

  const mailed = await sendSystemTransactionalEmail({
    to: [email],
    subject: styled.subject,
    text: styled.text,
    html: styled.html,
    logSentBy: "password-reset",
  });

  if (!mailed.ok && process.env.NODE_ENV === "development") {
    console.warn("[admin-password-reset] Email send failed:", mailed.error);
    console.warn("[admin-password-reset] Dev reset URL for", email, ":\n", link);
  }

  return genericOk;
}

export async function completeAdminPasswordReset(prev: ResetRequestState | null, formData: FormData): Promise<ResetRequestState> {
  void prev;
  const token = String(formData.get("token") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!token || password !== confirm) {
    return { ok: false, error: "Tokens or passwords mismatch — go back and use the complete form." };
  }
  const pwd = pwdSchema.safeParse(password);
  if (!pwd.success) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  if (!isDbConfigured()) {
    return {
      ok: false,
      error: "Password reset isn’t available right now. Contact your administrator.",
    };
  }

  const conn = await connectDB();
  if (!conn) return { ok: false, error: "Something went wrong. Try again later." };

  const tokenHash = hashResetToken(token);
  const admin = await Admin.findOne({
    resetTokenHash: tokenHash,
    resetTokenExpires: { $gt: new Date() },
  });
  if (!admin) {
    return {
      ok: false,
      error: "This link is invalid or has expired. Request a new one from Forgot password.",
    };
  }

  const passwordHash = await bcrypt.hash(pwd.data, 12);
  await Admin.updateOne(
    { _id: admin._id },
    {
      $set: { passwordHash },
      $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
    }
  );

  return { ok: true, message: "Your password has been updated. You can sign in now." };
}
