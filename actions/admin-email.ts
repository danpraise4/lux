"use server";

import { auth } from "@/auth";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import EmailLog from "@/models/EmailLog";
import { z } from "zod";

const sendSchema = z.object({
  to: z.array(z.string().email()).min(1).max(40),
  subject: z.string().min(2).max(200),
  body: z.string().min(10).max(20000),
});

export type SendFollowUpResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

function followUpHtml(subject: string, body: string) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const safe = esc(body);
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;padding:24px;">
<h1 style="font-size:18px;margin:0 0 16px;">${esc(subject)}</h1>
<pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${safe}</pre>
</body></html>`;
}

export async function sendAdminFollowUpEmail(raw: unknown): Promise<SendFollowUpResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, error: "Sign in required" };
  }

  const parsed = sendSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Check recipients (valid emails only), subject, and body length." };
  }
  const { to, subject, body } = parsed.data;
  const snippet = body.slice(0, 160);

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

  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "NMA Luxe <notifications@example.com>";

  if (!key) {
    await EmailLog.create({
      to,
      subject,
      snippet,
      sentByEmail: session.user.email || "",
      ok: false,
      error: "Outgoing email not configured",
    });
    return {
      ok: false,
      error: "Email sending isn’t set up yet. Ask your website administrator.",
    };
  }

  try {
    const html = followUpHtml(subject, body);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text: body,
        html,
      }),
    });
    const data = (await res.json()) as { message?: string; id?: string };
    if (!res.ok) {
      await EmailLog.create({
        to,
        subject,
        snippet,
        sentByEmail: session.user.email || "",
        ok: false,
        error: data.message || String(res.status),
      });
      return { ok: false, error: data.message || "The email could not be sent. Try again or contact support." };
    }
    await EmailLog.create({
      to,
      subject,
      snippet,
      sentByEmail: session.user.email || "",
      ok: true,
      error: "",
    });
    return {
      ok: true,
      message: "Your message was sent.",
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    await EmailLog.create({
      to,
      subject,
      snippet,
      sentByEmail: session.user.email || "",
      ok: false,
      error: msg,
    });
    return { ok: false, error: msg };
  }
}
