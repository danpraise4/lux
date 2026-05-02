"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";

const addSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional().default(""),
  title: z.string().min(2).max(200),
});

export type GalleryActionState = { ok: true; message?: string } | { ok: false; error: string };

export async function addGalleryImage(_prev: GalleryActionState | null, formData: FormData): Promise<GalleryActionState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Sign in required" };
  }
  if (!isDbConfigured()) {
    return { ok: false, error: "Saving isn’t available right now. Try again later or ask your administrator." };
  }
  const raw = {
    url: String(formData.get("url") || ""),
    publicId: String(formData.get("publicId") || ""),
    title: String(formData.get("title") || ""),
  };
  const parsed = addSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Add a short caption and a valid image." };
  }
  const conn = await connectDB();
  if (!conn) {
    return { ok: false, error: "Something went wrong. Try again in a moment." };
  }
  const count = await GalleryImage.countDocuments();
  await GalleryImage.create({
    url: parsed.data.url,
    publicId: parsed.data.publicId,
    title: parsed.data.title,
    order: count,
  });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { ok: true, message: "Photo added." };
}

export async function removeGalleryImage(id: string): Promise<GalleryActionState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Sign in required" };
  }
  if (!isDbConfigured() || !id) {
    return { ok: false, error: "Could not remove this item." };
  }
  const conn = await connectDB();
  if (!conn) {
    return { ok: false, error: "Something went wrong." };
  }
  await GalleryImage.findByIdAndDelete(id);
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { ok: true, message: "Removed." };
}
