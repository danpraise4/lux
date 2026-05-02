import { envSiteUrl } from "@/lib/server-env";

/** Base URL for absolute links (password reset emails, etc.). Prefer AUTH_URL then public site URL. */
export function getServerSiteOrigin(): string {
  const raw =
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    envSiteUrl() ||
    "";
  try {
    if (!raw) return "http://localhost:3000";
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return u.origin;
  } catch {
    return "http://localhost:3000";
  }
}
