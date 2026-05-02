import { NextResponse } from "next/server";

/** Auth.js has no `/login` action (only `signin`, `session`, etc.). Some clients still open `/api/auth/login`. */
export function GET(req: Request) {
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export function POST(req: Request) {
  return NextResponse.redirect(new URL("/admin/login", req.url));
}
