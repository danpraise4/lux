/**
 * Central env access — use these getters instead of scattering `process.env.*`.
 *
 * Typically set in `.env` / Vercel:
 * - `MONGODB_URI`, `NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET` (or `NEXTAUTH_SECRET`)
 * - `RESEND_API_KEY` + `RESEND_FROM_EMAIL` or `EMAIL_FROM` (see `lib/email-from-env.ts`)
 * - `FLUTTERWAVE_SECRET_KEY`; webhook verification: `FLUTTERWAVE_SECRET_HASH` (or `FLUTTERWAVE_WEBHOOK_SECRET`)
 *   — not the same as Flutterwave’s encryption key used for client tokenization
 * - Optional Paystack: `PAYSTACK_SECRET_KEY` (alias `PAYSTACK_SECRET`), `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
 * - Optional ops inboxes: `ADMIN_NOTIFICATION_EMAIL` (alias `ADMIN_NOTIFY_EMAIL`)
 * - Upload: `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`
 */

export function envMongoUri(): string | undefined {
  return process.env.MONGODB_URI?.trim();
}

/** NextAuth / Auth.js secret */
export function envAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
}

export function envSiteUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim();
}

export function envResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY?.trim();
}

/** Flutterwave API secret (Bearer token for REST). */
export function envFlutterwaveSecretKey(): string | undefined {
  return process.env.FLUTTERWAVE_SECRET_KEY?.trim();
}

/**
 * Must match Flutterwave dashboard → Webhooks → “Secret hash” (`verif-hash` header).
 * Alias: FLUTTERWAVE_WEBHOOK_SECRET (same value, different env name).
 */
export function envFlutterwaveWebhookSecretHash(): string | undefined {
  return (
    process.env.FLUTTERWAVE_SECRET_HASH?.trim() ||
    process.env.FLUTTERWAVE_WEBHOOK_SECRET?.trim()
  );
}

export function envPaystackSecretKey(): string | undefined {
  return process.env.PAYSTACK_SECRET_KEY?.trim() || process.env.PAYSTACK_SECRET?.trim();
}

/**
 * Client-side Paystack key (booking wizard). Prefer NEXT_PUBLIC_* so it can be inlined.
 * Alias: NEXT_PUBLIC_PAYSTACK_PUBLIC (some deployments omit `_KEY`).
 */
export function envPaystackPublicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() ||
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC?.trim()
  );
}

/**
 * Comma/semicolon list of ops inboxes for inquiry & booking alerts.
 * Alias: ADMIN_NOTIFY_EMAIL
 */
export function envAdminNotificationEmailRaw(): string | undefined {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || process.env.ADMIN_NOTIFY_EMAIL?.trim()
  );
}
