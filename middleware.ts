import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

/** Edge-safe: do not import `@/auth` here (mongoose would pull Node `stream`). */
const edgeAuth = NextAuth(authConfig);

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export default edgeAuth.auth((req) => {
  const path = req.nextUrl.pathname;
  const loggedIn = !!req.auth;
  const adminPublic = PUBLIC_ADMIN_PATHS.has(path);

  if (path.startsWith("/admin") && !adminPublic && !loggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if ((path === "/admin/login" || path === "/admin/forgot-password") && loggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
