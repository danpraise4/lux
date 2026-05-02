import { sendSystemTransactionalEmail } from "@/lib/send-system-email";
import { getAdminNotificationEmails } from "@/lib/email/admin-recipients";
import {
  adminBalancePaidEmail,
  adminNewDepositEmail,
  adminNewFullPaymentEmail,
  adminTripPricingUpdatedEmail,
  guestBalancePaidEmail,
  guestBookingStatusUpdatedEmail,
  guestDepositPaidEmail,
  guestFullPaidEmail,
  guestTripPricingUpdatedEmail,
} from "@/lib/email/templates";
import { SITE } from "@/lib/constants";
import { envSiteUrl } from "@/lib/server-env";
import type { Booking } from "@/models/Booking";

function bookingManageUrl(token?: string | null): string {
  if (!token) return "";
  const base = (envSiteUrl() || SITE.url || "http://localhost:3000").replace(/\/$/, "");
  return `${base}/booking/manage/${encodeURIComponent(token)}`;
}

export async function sendBookingStatusUpdatedEmail(booking: Booking) {
  const manageBookingUrl = bookingManageUrl(booking.manageToken);
  const guest = guestBookingStatusUpdatedEmail({
    leadName: booking.leadName,
    reference: booking.reference,
    packageTitle: booking.packageTitle,
    status: booking.status,
    manageBookingUrl: manageBookingUrl || undefined,
  });

  await sendSystemTransactionalEmail({
    to: [booking.leadEmail],
    subject: guest.subject,
    text: guest.text,
    html: guest.html,
    logSentBy: "booking-status-guest",
  });
}

export async function sendTripPricingUpdatedEmail(
  booking: Booking,
  opts?: { notifyGuest?: boolean }
) {
  const notifyGuest = opts?.notifyGuest !== false;
  const manageBookingUrl = bookingManageUrl(booking.manageToken);

  if (notifyGuest) {
    const guest = guestTripPricingUpdatedEmail({
      reference: booking.reference,
      leadName: booking.leadName,
      packageTitle: booking.packageTitle,
      priceTotal: booking.priceTotal,
      balanceAmount: booking.balanceAmount,
      depositAmount: booking.depositAmount,
      manageBookingUrl: manageBookingUrl || undefined,
      pricingNoteFromAdmin: booking.pricingNoteFromAdmin || undefined,
    });

    await sendSystemTransactionalEmail({
      to: [booking.leadEmail],
      subject: guest.subject,
      text: guest.text,
      html: guest.html,
      logSentBy: "pricing-updated-guest",
    });
  }

  const admins = getAdminNotificationEmails();
  if (admins.length) {
    const admin = adminTripPricingUpdatedEmail({
      reference: booking.reference,
      leadName: booking.leadName,
      leadEmail: booking.leadEmail,
      packageTitle: booking.packageTitle,
      priceTotal: booking.priceTotal,
      balanceAmount: booking.balanceAmount,
      pricingNoteFromAdmin: booking.pricingNoteFromAdmin || undefined,
    });
    await sendSystemTransactionalEmail({
      to: admins,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      logSentBy: "pricing-updated-admin",
    });
  }
}

export async function sendDepositConfirmationEmails(booking: Booking) {
  const manageBookingUrl = bookingManageUrl(booking.manageToken);
  const guest = guestDepositPaidEmail({
    reference: booking.reference,
    leadName: booking.leadName,
    packageTitle: booking.packageTitle,
    startDate: booking.startDate,
    travelersCount: booking.travelersCount,
    depositAmount: booking.depositAmount,
    priceTotal: booking.priceTotal,
    balanceAmount: booking.balanceAmount,
    leadEmail: booking.leadEmail,
    manageBookingUrl: manageBookingUrl || undefined,
  });

  await sendSystemTransactionalEmail({
    to: [booking.leadEmail],
    subject: guest.subject,
    text: guest.text,
    html: guest.html,
    logSentBy: "deposit-confirmation-guest",
  });

  const admins = getAdminNotificationEmails();
  if (admins.length) {
    const admin = adminNewDepositEmail({
      reference: booking.reference,
      leadName: booking.leadName,
      leadEmail: booking.leadEmail,
      leadPhone: booking.leadPhone,
      packageTitle: booking.packageTitle,
      startDate: booking.startDate,
      travelersCount: booking.travelersCount,
      depositAmount: booking.depositAmount,
      priceTotal: booking.priceTotal,
    });
    await sendSystemTransactionalEmail({
      to: admins,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      logSentBy: "deposit-notification-admin",
    });
  }
}

export async function sendFullPaymentConfirmationEmails(booking: Booking) {
  const manageBookingUrl = bookingManageUrl(booking.manageToken);
  const guest = guestFullPaidEmail({
    reference: booking.reference,
    leadName: booking.leadName,
    packageTitle: booking.packageTitle,
    startDate: booking.startDate,
    travelersCount: booking.travelersCount,
    priceTotal: booking.priceTotal,
    manageBookingUrl: manageBookingUrl || undefined,
  });

  await sendSystemTransactionalEmail({
    to: [booking.leadEmail],
    subject: guest.subject,
    text: guest.text,
    html: guest.html,
    logSentBy: "full-payment-confirmation-guest",
  });

  const admins = getAdminNotificationEmails();
  if (admins.length) {
    const admin = adminNewFullPaymentEmail({
      reference: booking.reference,
      leadName: booking.leadName,
      leadEmail: booking.leadEmail,
      leadPhone: booking.leadPhone,
      packageTitle: booking.packageTitle,
      startDate: booking.startDate,
      travelersCount: booking.travelersCount,
      priceTotal: booking.priceTotal,
    });
    await sendSystemTransactionalEmail({
      to: admins,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      logSentBy: "full-payment-notification-admin",
    });
  }
}

export async function sendBalancePaidEmails(booking: Booking) {
  const manageBookingUrl = bookingManageUrl(booking.manageToken);
  const guest = guestBalancePaidEmail({
    reference: booking.reference,
    leadName: booking.leadName,
    packageTitle: booking.packageTitle,
    priceTotal: booking.priceTotal,
    manageBookingUrl: manageBookingUrl || undefined,
  });

  await sendSystemTransactionalEmail({
    to: [booking.leadEmail],
    subject: guest.subject,
    text: guest.text,
    html: guest.html,
    logSentBy: "balance-paid-guest",
  });

  const admins = getAdminNotificationEmails();
  if (admins.length) {
    const admin = adminBalancePaidEmail({
      reference: booking.reference,
      leadName: booking.leadName,
      leadEmail: booking.leadEmail,
      packageTitle: booking.packageTitle,
      priceTotal: booking.priceTotal,
    });
    await sendSystemTransactionalEmail({
      to: admins,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      logSentBy: "balance-paid-admin",
    });
  }
}
