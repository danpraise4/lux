/**
 * Resend "from" header. Supports either env name:
 * - EMAIL_FROM (e.g. `NMA Luxe <hello@domain.com>`)
 * - RESEND_FROM_EMAIL (e.g. `noreply@domain.com`) — common Resend convention
 */
export function getResendFromAddress(): string {
  const a = process.env.EMAIL_FROM?.trim();
  const b = process.env.RESEND_FROM_EMAIL?.trim();
  return a || b || "NMA Luxe <notifications@example.com>";
}

export function isResendFromConfigured(): boolean {
  return Boolean(process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM_EMAIL?.trim());
}
