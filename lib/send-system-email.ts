import { connectDB, isDbConfigured } from "@/lib/mongodb";
import EmailLog from "@/models/EmailLog";
import { getResendFromAddress } from "@/lib/email-from-env";
import { envResendApiKey } from "@/lib/server-env";

export type SendSystemEmailResult =
  | { ok: true; skipped?: boolean; message?: string }
  | { ok: false; error: string };

/**
 * Sends a transactional email via Resend (no admin session required).
 * Optionally logs result to EmailLog when MongoDB is configured.
 */
export async function sendSystemTransactionalEmail(opts: {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  logSentBy?: string;
}): Promise<SendSystemEmailResult> {
  const { to, subject, text, html, logSentBy = "system" } = opts;
  const snippet = text.slice(0, 160);
  const key = envResendApiKey();
  const from = getResendFromAddress();

  if (!key) {
    if (isDbConfigured()) {
      const conn = await connectDB();
      if (conn) {
        await EmailLog.create({
          to,
          subject,
          snippet,
          sentByEmail: logSentBy,
          ok: false,
          error: "RESEND_API_KEY missing",
        });
      }
    }
    return {
      ok: false,
      error: "Outgoing mail is not configured (RESEND_API_KEY and EMAIL_FROM or RESEND_FROM_EMAIL).",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text, ...(html ? { html } : {}) }),
    });
    const data = (await res.json()) as { message?: string; id?: string };
    const okBody = res.ok;

    if (isDbConfigured()) {
      const conn = await connectDB();
      if (conn) {
        await EmailLog.create({
          to,
          subject,
          snippet,
          sentByEmail: logSentBy,
          ok: okBody,
          error: okBody ? "" : data.message || String(res.status),
        });
      }
    }

    if (!okBody) {
      return { ok: false, error: data.message || "Resend rejected the send" };
    }
    return { ok: true, message: data.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    if (isDbConfigured()) {
      const conn = await connectDB();
      if (conn) {
        await EmailLog.create({
          to,
          subject,
          snippet,
          sentByEmail: logSentBy,
          ok: false,
          error: msg,
        });
      }
    }
    return { ok: false, error: msg };
  }
}
