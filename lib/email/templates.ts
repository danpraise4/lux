import { formatNaira } from "@/lib/utils";
import { escapeHtml } from "@/lib/escape-html";
import { SITE } from "@/lib/constants";
import {
  brand,
  emailShell,
  emailPrimaryButton,
  emailDetailCard,
  emailParagraph,
  emailMutedNote,
  emailQuoteBox,
  type DetailRow,
} from "@/lib/email/email-layout";

function row(label: string, value: string): DetailRow {
  return { label, value: escapeHtml(value) };
}

function fmtDate(d: Date | undefined): string {
  if (!d || !(d instanceof Date) || Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-NG", { dateStyle: "long" });
}

const adminSiteUrl = SITE.url.replace(/\/$/, "");

/* ─── Booking — guest ─── */

export function guestDepositPaidEmail(booking: {
  reference: string;
  leadName: string;
  packageTitle: string;
  startDate: Date;
  travelersCount: number;
  depositAmount: number;
  priceTotal: number;
  balanceAmount: number;
  leadEmail: string;
  manageBookingUrl?: string;
}) {
  const ref = booking.reference;
  const headline = "Payment received";
  const start = fmtDate(booking.startDate);

  const innerRows: DetailRow[] = [
    row("Booking reference", ref),
    row("Tour", booking.packageTitle),
    row("Start date", start),
    row("Travelers", String(booking.travelersCount)),
    row("Deposit paid", formatNaira(booking.depositAmount)),
    row("Trip estimate", formatNaira(booking.priceTotal)),
  ];

  let extra = "";
  if (booking.manageBookingUrl && booking.balanceAmount > 0) {
    extra += emailParagraph(
      `<strong style="color:#5c5650;">Remaining balance:</strong> ${escapeHtml(formatNaira(booking.balanceAmount))}`
    );
    extra += emailPrimaryButton(booking.manageBookingUrl, "Manage booking & pay balance");
    extra += emailMutedNote(
      "Use your secure link anytime to complete payment or review trip details. This link is unique to your booking."
    );
  }

  const inner =
    emailParagraph(`Dear ${escapeHtml(booking.leadName)},`) +
    emailParagraph(
      `Thank you — we've received your deposit. Your booking is confirmed with reference <strong>${escapeHtml(ref)}</strong>.`
    ) +
    emailDetailCard(innerRows) +
    extra +
    emailMutedNote("Keep this email as your receipt. Our team will follow up to confirm dates and logistics.");

  const textLines = [
    `${brand} — Deposit received (${ref})`,
    ``,
    `Dear ${booking.leadName},`,
    ``,
    `We've received your deposit for ${booking.packageTitle}.`,
    `Reference: ${ref}`,
    `Start: ${start}`,
    `Travelers: ${booking.travelersCount}`,
    `Deposit: ${formatNaira(booking.depositAmount)}`,
    `Trip estimate: ${formatNaira(booking.priceTotal)}`,
  ];
  if (booking.manageBookingUrl && booking.balanceAmount > 0) {
    textLines.push(``, `Remaining balance: ${formatNaira(booking.balanceAmount)}`, `Manage: ${booking.manageBookingUrl}`);
  }
  textLines.push(``, brand);

  return {
    subject: `${brand} — Deposit received (${ref})`,
    html: emailShell({
      preheader: `Deposit received for ${booking.packageTitle}. Reference ${ref}.`,
      headline,
      innerHtml: inner,
      variant: "guest",
    }),
    text: textLines.join("\n"),
  };
}

export function guestFullPaidEmail(booking: {
  reference: string;
  leadName: string;
  packageTitle: string;
  startDate: Date;
  travelersCount: number;
  priceTotal: number;
  manageBookingUrl?: string;
}) {
  const ref = booking.reference;
  const start = fmtDate(booking.startDate);
  const rows: DetailRow[] = [
    row("Reference", ref),
    row("Tour", booking.packageTitle),
    row("Start date", start),
    row("Travelers", String(booking.travelersCount)),
    row("Amount paid", formatNaira(booking.priceTotal)),
  ];

  let extra = "";
  if (booking.manageBookingUrl) {
    extra += emailPrimaryButton(booking.manageBookingUrl, "View booking summary");
    extra += emailMutedNote("Your personal link for receipts and trip details.");
  }

  const inner =
    emailParagraph(`Dear ${escapeHtml(booking.leadName)},`) +
    emailParagraph(
      `We've received payment in full for your trip. Thank you for choosing ${escapeHtml(brand)}.`
    ) +
    emailDetailCard(rows) +
    extra +
    emailMutedNote("We'll confirm dates and logistics with you shortly.");

  const text = [
    `${brand} — Trip paid in full (${ref})`,
    ``,
    `Dear ${booking.leadName},`,
    ``,
    `Full payment received for ${booking.packageTitle}.`,
    `Amount: ${formatNaira(booking.priceTotal)}`,
    booking.manageBookingUrl ? `Summary: ${booking.manageBookingUrl}` : "",
    ``,
    brand,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `${brand} — Trip paid in full (${ref})`,
    html: emailShell({
      preheader: `Payment in full received. Reference ${ref}.`,
      headline: "You're fully paid up",
      innerHtml: inner,
      variant: "guest",
    }),
    text,
  };
}

export function guestBalancePaidEmail(booking: {
  reference: string;
  leadName: string;
  packageTitle: string;
  priceTotal: number;
  manageBookingUrl?: string;
}) {
  const ref = booking.reference;
  let extra = "";
  if (booking.manageBookingUrl) {
    extra += emailPrimaryButton(booking.manageBookingUrl, "View booking summary");
  }

  const inner =
    emailParagraph(`Dear ${escapeHtml(booking.leadName)},`) +
    emailParagraph(
      `We've received your remaining balance for <strong>${escapeHtml(booking.packageTitle)}</strong>. Reference <strong>${escapeHtml(ref)}</strong>.`
    ) +
    emailDetailCard([row("Trip total", formatNaira(booking.priceTotal)), row("Status", "Paid in full")]) +
    extra +
    emailMutedNote("Thank you — we look forward to hosting you.");

  const text = [
    `${brand} — Balance received (${ref})`,
    ``,
    `Dear ${booking.leadName},`,
    ``,
    `Balance received for ${booking.packageTitle}. Trip total ${formatNaira(booking.priceTotal)}.`,
    booking.manageBookingUrl ? `Summary: ${booking.manageBookingUrl}` : "",
    ``,
    brand,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `${brand} — Balance received (${ref})`,
    html: emailShell({
      preheader: `Balance received — booking ${ref} is fully paid.`,
      headline: "Balance received — you're all set",
      innerHtml: inner,
      variant: "guest",
    }),
    text,
  };
}

export function guestTripPricingUpdatedEmail(booking: {
  reference: string;
  leadName: string;
  packageTitle: string;
  priceTotal: number;
  balanceAmount: number;
  depositAmount: number;
  manageBookingUrl?: string;
  pricingNoteFromAdmin?: string;
}) {
  const ref = booking.reference;

  let note = "";
  if (booking.pricingNoteFromAdmin?.trim()) {
    note = emailQuoteBox(
      `<strong style="color:#8f7336;">From our team</strong><br/><span style="color:#1a1814;">${escapeHtml(booking.pricingNoteFromAdmin.trim()).replace(/\n/g, "<br/>")}</span>`
    );
  }

  let cta = "";
  if (booking.manageBookingUrl) {
    cta += emailPrimaryButton(booking.manageBookingUrl, "Review & complete payment");
    cta += emailMutedNote("Pay any remaining balance securely — link is unique to your booking.");
  }

  const inner =
    emailParagraph(`Dear ${escapeHtml(booking.leadName)},`) +
    emailParagraph(
      `We've updated your trip estimate for <strong>${escapeHtml(booking.packageTitle)}</strong> (reference <strong>${escapeHtml(ref)}</strong>), including logistics and add-ons we discussed.`
    ) +
    note +
    emailDetailCard([
      row("New trip total", formatNaira(booking.priceTotal)),
      row("Deposit portion (reference)", formatNaira(booking.depositAmount)),
      row("Balance remaining", formatNaira(booking.balanceAmount)),
    ]) +
    cta +
    emailMutedNote("Questions? Reply to this email or reach us via the contact details below.");

  const textLines = [
    `${brand} — Updated trip quote (${ref})`,
    ``,
    `Dear ${booking.leadName},`,
    ``,
    `We've updated your estimate for ${booking.packageTitle}.`,
    booking.pricingNoteFromAdmin?.trim() ? `Note: ${booking.pricingNoteFromAdmin.trim()}` : "",
    `New total: ${formatNaira(booking.priceTotal)}`,
    `Balance remaining: ${formatNaira(booking.balanceAmount)}`,
    booking.manageBookingUrl ? `Pay here: ${booking.manageBookingUrl}` : "",
    ``,
    brand,
  ].filter(Boolean);

  return {
    subject: `${brand} — Updated trip quote (${ref})`,
    html: emailShell({
      preheader: `Your quote was updated. New total ${formatNaira(booking.priceTotal)}.`,
      headline: "Your trip quote was updated",
      innerHtml: inner,
      variant: "guest",
    }),
    text: textLines.join("\n"),
  };
}

function formatBookingStatusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function guestBookingStatusUpdatedEmail(opts: {
  leadName: string;
  reference: string;
  packageTitle: string;
  status: string;
  manageBookingUrl?: string;
}) {
  const ref = opts.reference;
  const statusLabel = formatBookingStatusLabel(opts.status);

  let cta = "";
  if (opts.manageBookingUrl) {
    cta =
      emailPrimaryButton(opts.manageBookingUrl, "View booking & payment") +
      emailMutedNote("Use your secure link to review details or complete payment.");
  }

  const inner =
    emailParagraph(`Dear ${escapeHtml(opts.leadName)},`) +
    emailParagraph(
      `Your booking <strong>${escapeHtml(ref)}</strong> for <strong>${escapeHtml(opts.packageTitle)}</strong> has been updated.`
    ) +
    emailDetailCard([
      row("New status", statusLabel),
      row("Reference", ref),
      row("Tour", opts.packageTitle),
    ]) +
    cta +
    emailMutedNote(`If you have questions, reply to this email or contact us at ${escapeHtml(SITE.email)}.`);

  const text = [
    `${brand} — Booking status update (${ref})`,
    ``,
    `Dear ${opts.leadName},`,
    ``,
    `Your booking status is now: ${statusLabel}.`,
    `Reference: ${ref} · ${opts.packageTitle}`,
    opts.manageBookingUrl ? `Manage booking: ${opts.manageBookingUrl}` : "",
    ``,
    brand,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `${brand} — Booking update · ${statusLabel} (${ref})`,
    html: emailShell({
      preheader: `Your booking status is now ${statusLabel}.`,
      headline: "Booking status updated",
      innerHtml: inner,
      variant: "guest",
    }),
    text,
  };
}

/* ─── Booking — admin ─── */

export function adminNewDepositEmail(booking: {
  reference: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  packageTitle: string;
  startDate: Date;
  travelersCount: number;
  depositAmount: number;
  priceTotal: number;
}) {
  const start = fmtDate(booking.startDate);
  const inner =
    emailParagraph(`New deposit captured through checkout.`) +
    emailDetailCard([
      row("Reference", booking.reference),
      row("Guest", `${booking.leadName}`),
      row("Email", booking.leadEmail),
      row("Phone", booking.leadPhone),
      row("Package", booking.packageTitle),
      row("Start date", start),
      row("Travelers", String(booking.travelersCount)),
      row("Deposit", formatNaira(booking.depositAmount)),
      row("Trip estimate", formatNaira(booking.priceTotal)),
    ]) +
    emailPrimaryButton(`${adminSiteUrl}/admin/bookings`, "Open bookings");

  const text = [
    `New deposit — ${booking.reference}`,
    `Guest: ${booking.leadName} <${booking.leadEmail}> ${booking.leadPhone}`,
    `Package: ${booking.packageTitle}`,
    `Deposit ${formatNaira(booking.depositAmount)} · Estimate ${formatNaira(booking.priceTotal)}`,
  ].join("\n");

  return {
    subject: `[${brand}] New deposit ${booking.reference}`,
    html: emailShell({
      preheader: `Deposit ${formatNaira(booking.depositAmount)} · ${booking.reference}`,
      headline: "New deposit received",
      innerHtml: inner,
      variant: "ops",
    }),
    text,
  };
}

export function adminNewFullPaymentEmail(booking: {
  reference: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  packageTitle: string;
  startDate: Date;
  travelersCount: number;
  priceTotal: number;
}) {
  const start = fmtDate(booking.startDate);
  const inner =
    emailParagraph(`Guest paid the full trip amount online.`) +
    emailDetailCard([
      row("Reference", booking.reference),
      row("Guest", booking.leadName),
      row("Email", booking.leadEmail),
      row("Phone", booking.leadPhone),
      row("Package", booking.packageTitle),
      row("Start", start),
      row("Travelers", String(booking.travelersCount)),
      row("Paid in full", formatNaira(booking.priceTotal)),
    ]) +
    emailPrimaryButton(`${adminSiteUrl}/admin/bookings`, "View booking");

  const text = [`Full payment ${booking.reference}`, `Guest: ${booking.leadName}`, `Amount ${formatNaira(booking.priceTotal)}`].join("\n");

  return {
    subject: `[${brand}] Full payment ${booking.reference}`,
    html: emailShell({
      preheader: `Full payment ${formatNaira(booking.priceTotal)} · ${booking.reference}`,
      headline: "Trip paid in full",
      innerHtml: inner,
      variant: "ops",
    }),
    text,
  };
}

export function adminBalancePaidEmail(booking: {
  reference: string;
  leadName: string;
  leadEmail: string;
  packageTitle: string;
  priceTotal: number;
}) {
  const inner =
    emailParagraph(`Final balance collected — booking marked paid.`) +
    emailDetailCard([
      row("Reference", booking.reference),
      row("Guest", `${booking.leadName} · ${booking.leadEmail}`),
      row("Package", booking.packageTitle),
      row("Trip total", formatNaira(booking.priceTotal)),
    ]) +
    emailPrimaryButton(`${adminSiteUrl}/admin/bookings`, "Bookings");

  const text = [`Balance paid — ${booking.reference}`, `Guest ${booking.leadName}`, `Total ${formatNaira(booking.priceTotal)}`].join("\n");

  return {
    subject: `[${brand}] Balance paid ${booking.reference}`,
    html: emailShell({
      preheader: `Balance settled · ${booking.reference}`,
      headline: "Balance payment received",
      innerHtml: inner,
      variant: "ops",
    }),
    text,
  };
}

export function adminTripPricingUpdatedEmail(booking: {
  reference: string;
  leadName: string;
  leadEmail: string;
  packageTitle: string;
  priceTotal: number;
  balanceAmount: number;
  pricingNoteFromAdmin?: string;
}) {
  let note = "";
  if (booking.pricingNoteFromAdmin?.trim()) {
    note = emailQuoteBox(`<strong>Note to guest:</strong> ${escapeHtml(booking.pricingNoteFromAdmin.trim())}`);
  }

  const inner =
    emailParagraph(`Trip total was revised from the admin dashboard.`) +
    note +
    emailDetailCard([
      row("Reference", booking.reference),
      row("Guest", `${booking.leadName} · ${booking.leadEmail}`),
      row("Package", booking.packageTitle),
      row("New trip total", formatNaira(booking.priceTotal)),
      row("Balance remaining", formatNaira(booking.balanceAmount)),
    ]) +
    emailPrimaryButton(`${adminSiteUrl}/admin/bookings`, "Open admin bookings");

  const text = [
    `Quote updated — ${booking.reference}`,
    `Guest: ${booking.leadName}`,
    `New total ${formatNaira(booking.priceTotal)} · Balance ${formatNaira(booking.balanceAmount)}`,
  ].join("\n");

  return {
    subject: `[${brand}] Quote updated ${booking.reference}`,
    html: emailShell({
      preheader: `Trip quote updated for ${booking.reference}`,
      headline: "Trip quote updated",
      innerHtml: inner,
      variant: "ops",
    }),
    text,
  };
}

/* ─── Leads & newsletter ─── */

export function guestCorporateThankYouEmail(contactName: string) {
  const inner =
    emailParagraph(`Dear ${escapeHtml(contactName)},`) +
    emailParagraph(
      `Thank you for your corporate travel inquiry with ${escapeHtml(brand)}. Our team has received your details and will respond shortly to discuss your programme, dates, and budget.`
    ) +
    emailMutedNote(`You can also reach us at ${escapeHtml(SITE.email)} or ${escapeHtml(SITE.phone)}.`);

  return {
    subject: `${brand} — We received your corporate inquiry`,
    html: emailShell({
      preheader: "Thank you — we'll be in touch soon.",
      headline: "Request received",
      innerHtml: inner,
      variant: "guest",
    }),
    text: `Dear ${contactName},\n\nThank you for contacting ${brand} about corporate travel. We'll respond shortly.\n\n${SITE.email}`,
  };
}

export function adminCorporateLeadEmail(lead: {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
  teamSize: string;
}) {
  const inner =
    emailParagraph(`New corporate travel lead from the website form.`) +
    emailDetailCard([
      row("Company", lead.company),
      row("Contact", lead.contactName),
      row("Email", lead.email),
      row("Phone", lead.phone),
      row("Team size", lead.teamSize || "—"),
      row("Message", lead.message?.trim() || "—"),
    ]) +
    emailPrimaryButton(`${adminSiteUrl}/admin/corporate`, "CRM — Corporate");

  return {
    subject: `[${brand}] Corporate lead · ${lead.company}`,
    html: emailShell({
      preheader: `Corporate inquiry from ${lead.company}`,
      headline: "New corporate inquiry",
      innerHtml: inner,
      variant: "ops",
    }),
    text: `Corporate lead\n${lead.company}\n${lead.contactName}\n${lead.email}\n${lead.phone}\n${lead.message}`,
  };
}

export function guestCustomTripThankYouEmail(name: string) {
  const inner =
    emailParagraph(`Dear ${escapeHtml(name)},`) +
    emailParagraph(
      `Thank you for your bespoke trip request. A travel designer at ${escapeHtml(brand)} will review your preferences and reach out with ideas and next steps.`
    ) +
    emailMutedNote(`Questions? ${escapeHtml(SITE.email)}`);

  return {
    subject: `${brand} — Custom trip request received`,
    html: emailShell({
      preheader: "We're reviewing your bespoke trip details.",
      headline: "Your custom trip request",
      innerHtml: inner,
      variant: "guest",
    }),
    text: `Dear ${name},\n\nWe received your custom trip request. We'll be in touch soon.\n\n${brand}`,
  };
}

export function adminCustomTripEmail(data: {
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
}) {
  const inner =
    emailParagraph(`New bespoke trip request submitted on the website.`) +
    emailDetailCard([
      row("Name", data.name),
      row("Email", data.email),
      row("Phone", data.phone),
      row("Destination / theme", data.destination || "—"),
      row("Budget", data.budget || "—"),
      row("Travel window", `${fmtDate(data.travelStart)} – ${fmtDate(data.travelEnd)}`),
      row("Travelers", String(data.numTravelers)),
      row("Dietary", data.dietary || "—"),
      row("Activity level", data.activityLevel),
      row("Notes", data.notes?.trim() || "—"),
    ]) +
    emailPrimaryButton(`${adminSiteUrl}/admin/crm`, "CRM inbox");

  return {
    subject: `[${brand}] Custom trip · ${data.name}`,
    html: emailShell({
      preheader: `Custom trip request from ${data.name}`,
      headline: "New custom trip request",
      innerHtml: inner,
      variant: "ops",
    }),
    text: `Custom trip\n${data.name}\n${data.email}\n${data.destination}`,
  };
}

export function guestNewsletterWelcomeEmail(emailAddr: string) {
  const inner =
    emailParagraph(`Hello,`) +
    emailParagraph(
      `You're subscribed to ${escapeHtml(brand)} updates — curated journeys, seasonal offers, and travel inspiration. We'll only send what matters.`
    ) +
    emailMutedNote(`Subscribed as ${escapeHtml(emailAddr)} · Unsubscribe any time via links in our emails.`);

  return {
    subject: `${brand} — You're on the list`,
    html: emailShell({
      preheader: "Welcome — luxury travel inspiration ahead.",
      headline: "You're subscribed",
      innerHtml: inner,
      variant: "guest",
    }),
    text: `You're subscribed to ${brand} updates at ${emailAddr}.`,
  };
}

export function adminNewsletterSignupEmail(subscriberEmail: string) {
  const inner =
    emailParagraph(`Someone joined the newsletter from the website.`) +
    emailDetailCard([row("Email", subscriberEmail), row("Source", "Website signup")]) +
    emailPrimaryButton(`${adminSiteUrl}/admin/newsletter`, "Newsletter list");

  return {
    subject: `[${brand}] Newsletter signup`,
    html: emailShell({
      preheader: `New subscriber ${subscriberEmail}`,
      headline: "Newsletter signup",
      innerHtml: inner,
      variant: "ops",
    }),
    text: `Newsletter signup: ${subscriberEmail}`,
  };
}

/* ─── Admin password reset ─── */

export function adminPasswordResetEmail(opts: { recipientName: string; resetLink: string }) {
  const { recipientName, resetLink } = opts;
  const inner =
    emailParagraph(`Hello ${escapeHtml(recipientName)},`) +
    emailParagraph(
      `We received a request to reset your password for the ${escapeHtml(brand)} admin dashboard. Use the button below — it expires in <strong>one hour</strong>.`
    ) +
    emailPrimaryButton(resetLink, "Choose a new password") +
    emailMutedNote(
      `If the button doesn't work, paste this link into your browser:<br/><span style="word-break:break-all;color:#8f7336;">${escapeHtml(resetLink)}</span>`
    ) +
    emailQuoteBox(
      `If you didn't request this, you can ignore this email — your password will stay the same.`
    );

  const text = [
    `Hello ${recipientName},`,
    ``,
    `Reset your admin password (valid 1 hour):`,
    resetLink,
    ``,
    `If you didn't ask for this, ignore this email.`,
    ``,
    brand,
  ].join("\n");

  return {
    subject: `${brand} — Reset your admin password`,
    html: emailShell({
      preheader: "Reset your admin password — link expires in 1 hour.",
      headline: "Password reset",
      innerHtml: inner,
      variant: "guest",
    }),
    text,
  };
}
