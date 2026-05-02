import { randomBytes } from "crypto";

/** Secret link segment for guest booking self-service (pay balance, view status). */
export function generateManageToken(): string {
  return randomBytes(24).toString("base64url");
}
