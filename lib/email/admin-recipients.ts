/**
 * Comma or semicolon separated list in `ADMIN_NOTIFICATION_EMAIL` (multiple staff inboxes).
 */
export function getAdminNotificationEmails(): string[] {
  const raw = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((e) => e.trim())
    .filter((e) => e.length > 3 && e.includes("@"));
}
