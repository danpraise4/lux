import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";

function configureCloudinary(): boolean {
  const raw = process.env.CLOUDINARY_URL;
  if (raw) {
    const parsed = /^cloudinary:\/\/([^:]+):([^@]+)@([^/]+)/.exec(raw);
    if (parsed) {
      cloudinary.config({
        cloud_name: parsed[3],
        api_key: parsed[1],
        api_secret: parsed[2],
      });
      return true;
    }
  }
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
    return true;
  }
  return false;
}

/**
 * Admin-only image upload to Cloudinary. Returns `{ url }` for package covers and CMS use.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!configureCloudinary()) {
    return NextResponse.json(
      { error: "Image hosting is not configured. Add CLOUDINARY_URL or CLOUDINARY_* to your environment." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type || "image/jpeg"};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "nma-luxe",
      resource_type: "image",
    });
    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
