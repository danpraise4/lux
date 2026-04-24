import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const loggedIn = !!req.auth;
  if (path.startsWith("/admin") && path !== "/admin/login" && !loggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (path === "/admin/login" && loggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
