import { connectDB, isDbConfigured } from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
import { galleryMoments } from "@/lib/gallery-moments";

export type HomeGalleryItem = { src: string; alt: string };

/**
 * Homepage “Moments in motion” strip: uses MongoDB gallery when configured and non-empty; otherwise curated defaults.
 */
export async function getHomeGallery(): Promise<HomeGalleryItem[]> {
  if (!isDbConfigured()) {
    return galleryMoments.map((m) => ({ src: m.src, alt: m.alt }));
  }
  try {
    const conn = await connectDB();
    if (!conn) {
      return galleryMoments.map((m) => ({ src: m.src, alt: m.alt }));
    }
    const list = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).lean();
    if (!list.length) {
      return galleryMoments.map((m) => ({ src: m.src, alt: m.alt }));
    }
    return list.map((img) => ({
      src: img.url,
      alt: img.title?.trim() || "Travel moment",
    }));
  } catch {
    return galleryMoments.map((m) => ({ src: m.src, alt: m.alt }));
  }
}
