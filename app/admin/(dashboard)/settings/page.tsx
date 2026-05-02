import { isResendFromConfigured } from "@/lib/email-from-env";
import {
  envAdminNotificationEmailRaw,
  envFlutterwaveSecretKey,
  envFlutterwaveWebhookSecretHash,
  envMongoUri,
  envPaystackPublicKey,
  envPaystackSecretKey,
  envResendApiKey,
  envSiteUrl,
} from "@/lib/server-env";

export default function AdminSettingsPage() {
  const mongo = Boolean(envMongoUri());
  const paystackPublic = Boolean(envPaystackPublicKey());
  const paystackSecret = Boolean(envPaystackSecretKey());
  const flutterwaveSecret = Boolean(envFlutterwaveSecretKey());
  const flutterwaveWebhookHash = Boolean(envFlutterwaveWebhookSecretHash());
  const resend = Boolean(envResendApiKey());
  const emailFrom = isResendFromConfigured();
  const adminNotify = Boolean(envAdminNotificationEmailRaw());
  const siteUrl = envSiteUrl() || "";

  const rows = [
    { label: "Database", ok: mongo, detail: mongo ? "Connected" : "Not connected" },
    { label: "Flutterwave (primary checkout)", ok: flutterwaveSecret, detail: flutterwaveSecret ? "Ready" : "Not set" },
    { label: "Flutterwave webhook verification", ok: flutterwaveWebhookHash, detail: flutterwaveWebhookHash ? "Secret hash set" : "Not set" },
    { label: "Online payments (Paystack publishable)", ok: paystackPublic, detail: paystackPublic ? "Ready" : "Not set" },
    { label: "Online payments (Paystack secret)", ok: paystackSecret, detail: paystackSecret ? "Ready" : "Not set" },
    { label: "Outgoing email", ok: resend, detail: resend ? "Ready" : "Not set" },
    { label: "Sender address for emails", ok: emailFrom, detail: emailFrom ? "Set" : "Not set" },
    {
      label: "Public website URL",
      ok: Boolean(siteUrl),
      detail: siteUrl || "Not set",
    },
    {
      label: "Admin booking alerts (email)",
      ok: adminNotify,
      detail: adminNotify ? "Address set" : "Not set",
    },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl">System status</h1>
      <p className="mt-3 text-sm text-zinc-600">
        This page shows whether core services are available. If something is missing, contact whoever manages your website or
        hosting.
      </p>

      <ul className="mt-8 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white text-sm">
        {rows.map((r) => (
          <li key={r.label} className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-zinc-900">{r.label}</p>
              <p className="mt-0.5 truncate text-xs text-zinc-600">{r.detail}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                r.ok ? "bg-emerald-100 text-emerald-900" : "bg-zinc-200 text-zinc-800"
              }`}
            >
              {r.ok ? "OK" : "Missing"}
            </span>
          </li>
        ))}
      </ul>

      {siteUrl ? (
        <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-5 text-sm">
          <h2 className="font-semibold text-zinc-900">Flutterwave webhook URL</h2>
          <p className="mt-2 text-zinc-600">
            In the Flutterwave dashboard, open <strong>Settings → Webhooks</strong> and add this address. Use the same secret
            hash in your site configuration (your developer or host can set it).
          </p>
          <p className="mt-3 break-all rounded-lg bg-zinc-50 p-3 font-mono text-xs text-zinc-800">
            {siteUrl.replace(/\/$/, "")}/api/flutterwave/webhook
          </p>
        </section>
      ) : null}

      <section className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-700">
        <h2 className="font-semibold text-zinc-900">Staff accounts</h2>
        <p className="mt-2">
          To add someone new or reset access, ask your website administrator. Staff cannot create accounts from this screen.
        </p>
      </section>
    </div>
  );
}
