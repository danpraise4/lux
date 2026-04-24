import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Server-side upload to Cloudinary. Set CLOUDINARY_URL or CLOUDINARY_* in env.
 * Install: `npm i cloudinary` and uncomment implementation when ready.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json(
      { error: "Cloudinary not configured. Add CLOUDINARY_URL to .env" },
      { status: 503 }
    );
  }
  return NextResponse.json({ message: "Use multipart form with cloudinary v2 in production." }, { status: 501 });
}
