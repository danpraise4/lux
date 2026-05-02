import { sendSystemTransactionalEmail } from "@/lib/send-system-email";
import { getAdminNotificationEmails } from "@/lib/email/admin-recipients";
import {
  adminCorporateLeadEmail,
  adminCustomTripEmail,
  adminNewsletterSignupEmail,
  guestCorporateStatusEmail,
  guestCorporateThankYouEmail,
  guestCustomTripStatusEmail,
  guestCustomTripThankYouEmail,
  guestNewsletterWelcomeEmail,
} from "@/lib/email/templates";

/** Corporate inquiry: thank-you to contact + alert ops (non-blocking on mail failure). */
export async function sendCorporateLeadEmails(lead: {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
  teamSize: string;
}): Promise<void> {
  try {
    const guest = guestCorporateThankYouEmail(lead.contactName);
    await sendSystemTransactionalEmail({
      to: [lead.email],
      subject: guest.subject,
      text: guest.text,
      html: guest.html,
      logSentBy: "corporate-thanks-guest",
    });
  } catch {
    /* ignore */
  }

  const admins = getAdminNotificationEmails();
  if (!admins.length) return;
  try {
    const admin = adminCorporateLeadEmail(lead);
    await sendSystemTransactionalEmail({
      to: admins,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      logSentBy: "corporate-lead-admin",
    });
  } catch {
    /* ignore */
  }
}

export async function sendCustomTripEmails(data: {
  name: string;
  email: string;
  phone: string;
  destination: string;
  budget: string;
  travelStart?: Date;
  travelEnd?: Date;
  numTravelers: number;
  dietary: string;
  activityLevel: string;
  notes: string;
}): Promise<void> {
  try {
    const guest = guestCustomTripThankYouEmail(data.name);
    await sendSystemTransactionalEmail({
      to: [data.email],
      subject: guest.subject,
      text: guest.text,
      html: guest.html,
      logSentBy: "custom-trip-thanks-guest",
    });
  } catch {
    /* ignore */
  }

  const admins = getAdminNotificationEmails();
  if (!admins.length) return;
  try {
    const admin = adminCustomTripEmail(data);
    await sendSystemTransactionalEmail({
      to: admins,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      logSentBy: "custom-trip-admin",
    });
  } catch {
    /* ignore */
  }
}

/** Optional ping when staff moves stage from admin (checkbox). Non-blocking. */
export async function sendCustomTripStatusNotification(opts: {
  email: string;
  name: string;
  status: string;
}): Promise<void> {
  try {
    const guest = guestCustomTripStatusEmail(opts.name, opts.status);
    await sendSystemTransactionalEmail({
      to: [opts.email],
      subject: guest.subject,
      text: guest.text,
      html: guest.html,
      logSentBy: "custom-trip-status-guest",
    });
  } catch {
    /* ignore */
  }
}

export async function sendCorporateStatusNotification(opts: {
  email: string;
  contactName: string;
  company: string;
  status: string;
}): Promise<void> {
  try {
    const guest = guestCorporateStatusEmail(opts.contactName, opts.company, opts.status);
    await sendSystemTransactionalEmail({
      to: [opts.email],
      subject: guest.subject,
      text: guest.text,
      html: guest.html,
      logSentBy: "corporate-status-guest",
    });
  } catch {
    /* ignore */
  }
}

/** After successful DB insert only (caller responsibility). */
export async function sendNewsletterSignupEmails(emailAddr: string): Promise<void> {
  try {
    const guest = guestNewsletterWelcomeEmail(emailAddr);
    await sendSystemTransactionalEmail({
      to: [emailAddr],
      subject: guest.subject,
      text: guest.text,
      html: guest.html,
      logSentBy: "newsletter-welcome-guest",
    });
  } catch {
    /* ignore */
  }

  const admins = getAdminNotificationEmails();
  if (!admins.length) return;
  try {
    const admin = adminNewsletterSignupEmail(emailAddr);
    await sendSystemTransactionalEmail({
      to: admins,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      logSentBy: "newsletter-signup-admin",
    });
  } catch {
    /* ignore */
  }
}
