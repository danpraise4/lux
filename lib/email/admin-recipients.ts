import { envAdminNotificationEmailRaw } from "@/lib/server-env";

/**
 * Comma or semicolon separated list in `ADMIN_NOTIFICATION_EMAIL` (multiple staff inboxes).
 * Alias: `ADMIN_NOTIFY_EMAIL`.
 */
export function getAdminNotificationEmails(): string[] {
  const raw = envAdminNotificationEmailRaw();
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((e) => e.trim())
    .filter((e) => e.length > 3 && e.includes("@"));
}
