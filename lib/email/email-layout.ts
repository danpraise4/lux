import { escapeHtml } from "@/lib/escape-html";
import { SITE } from "@/lib/constants";

export const brand = SITE.shortName || "NMA Luxe";

/** Email-safe palette (table-based layout for clients) */
const C = {
  pageBg: "#f0ebe3",
  card: "#ffffff",
  ink: "#1a1814",
  muted: "#5c5650",
  line: "#e3ddd3",
  gold: "#8f7336",
  goldLight: "#c4a24a",
  stone900: "#1c1917",
  stone100: "#f5f5f4",
} as const;

function footerBlock(): string {
  const siteUrl = escapeHtml(SITE.url.replace(/\/$/, ""));
  const mail = escapeHtml(SITE.email);
  const phone = escapeHtml(SITE.phone);
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid ${C.line};">
    <tr>
      <td style="padding:20px 0 8px;font-size:13px;line-height:1.65;color:${C.muted};">
        <strong style="color:${C.ink};">${escapeHtml(brand)}</strong><br/>
        ${escapeHtml(SITE.tagline)}
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 16px;font-size:12px;line-height:1.8;color:${C.muted};">
        <a href="${siteUrl}" style="color:${C.gold};text-decoration:none;font-weight:600;">Website</a>
        <span style="color:${C.line};">&nbsp;·&nbsp;</span>
        <a href="mailto:${mail}" style="color:${C.gold};text-decoration:none;">${mail}</a>
        <span style="color:${C.line};">&nbsp;·&nbsp;</span>
        ${phone}
      </td>
    </tr>
  </table>`;
}

/**
 * Primary CTA — bulletproof button table for Outlook-friendly rendering.
 */
export function emailPrimaryButton(href: string, label: string): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 8px;">
  <tr>
    <td style="border-radius:10px;background:${C.gold};box-shadow:0 3px 12px rgba(31,26,20,.18);">
      <a href="${safeHref}" target="_blank" rel="noopener noreferrer"
        style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;letter-spacing:0.02em;">
        ${safeLabel}
      </a>
    </td>
  </tr>
</table>`;
}

export type DetailRow = { label: string; value: string };

export function emailDetailCard(rows: DetailRow[]): string {
  const body = rows
    .map(
      (r, i) => `
    <tr>
      <td style="padding:14px 18px;border-bottom:${i < rows.length - 1 ? `1px solid ${C.line}` : "none"};font-size:13px;color:${C.muted};width:42%;vertical-align:top;">
        ${escapeHtml(r.label)}
      </td>
      <td style="padding:14px 18px;border-bottom:${i < rows.length - 1 ? `1px solid ${C.line}` : "none"};font-size:14px;color:${C.ink};font-weight:500;vertical-align:top;">
        ${r.value}
      </td>
    </tr>`
    )
    .join("");
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:18px 0;border-radius:12px;overflow:hidden;border:1px solid ${C.line};background:${C.card};">
  ${body}
</table>`;
}

export function emailParagraph(text: string): string {
  return `<p style="margin:0 0 14px;line-height:1.65;font-size:15px;color:${C.ink};">${text}</p>`;
}

export function emailMutedNote(text: string): string {
  return `<p style="margin:16px 0 0;line-height:1.55;font-size:13px;color:${C.muted};">${text}</p>`;
}

export function emailQuoteBox(htmlInner: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
  <tr>
    <td style="border-left:4px solid ${C.gold};padding:12px 16px;background:${C.stone100};border-radius:0 10px 10px 0;font-size:14px;line-height:1.6;color:${C.ink};">
      ${htmlInner}
    </td>
  </tr>
</table>`;
}

export type EmailShellOptions = {
  /** Hidden preview line in inbox */
  preheader?: string;
  headline: string;
  innerHtml: string;
  /** guest = gold accent; ops = dark staff ribbon */
  variant?: "guest" | "ops";
};

export function emailShell(opts: EmailShellOptions): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.pageBg};opacity:0;">${escapeHtml(opts.preheader)}</div>`
    : "";

  const opsRibbon =
    opts.variant === "ops"
      ? `<tr><td style="padding:0;background:${C.stone900};">
          <p style="margin:0;padding:12px 28px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#fafaf9;">
            Staff notification
          </p>
        </td></tr>`
      : "";

  const goldAccent =
    opts.variant === "ops"
      ? ""
      : `<tr><td style="padding:0;line-height:4px;font-size:4px;background:linear-gradient(90deg,${C.goldLight} 0%,${C.gold} 55%,#6b5829 100%);">&nbsp;</td></tr>`;

  const headlineStyle =
    opts.variant === "ops"
      ? `margin:0 0 18px;font-size:19px;font-weight:700;line-height:1.35;color:${C.ink};letter-spacing:-0.02em;`
      : `margin:0 0 18px;font-size:22px;font-weight:700;line-height:1.3;color:${C.ink};letter-spacing:-0.02em;font-family:Georgia,'Times New Roman',serif;`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>${escapeHtml(opts.headline)}</title>
</head>
<body style="margin:0;padding:0;background:${C.pageBg};-webkit-font-smoothing:antialiased;">
  ${preheader}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.pageBg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:580px;border-collapse:collapse;">
          ${goldAccent}
          ${opsRibbon}
          <tr>
            <td style="padding:28px 28px 8px;background:${C.card};border:1px solid ${C.line};border-bottom:none;border-radius:${opts.variant === "ops" ? "0" : "14px"} ${opts.variant === "ops" ? "0" : "14px"} 0 0;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${C.gold};">${escapeHtml(brand)}</p>
              <h1 style="${headlineStyle}">${escapeHtml(opts.headline)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;background:${C.card};border:1px solid ${C.line};border-top:none;border-radius:0 0 14px 14px;">
              ${opts.innerHtml}
              ${footerBlock()}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
