import { isDbConfigured, connectDB } from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function AdminGalleryPage() {
  let rows: { id: string; url: string; title: string; order: number }[] = [];

  if (isDbConfigured()) {
    const conn = await connectDB();
    if (conn) {
      const list = await GalleryImage.find().sort({ order: 1, createdAt: -1 }).lean();
      rows = list.map((g) => ({
        id: String(g._id),
        url: g.url,
        title: g.title || "",
        order: g.order ?? 0,
      }));
    }
  }

  return (
    <div className="min-w-0">
      <h1 className="font-serif text-2xl text-zinc-950">Homepage gallery</h1>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-zinc-700">
        These photos appear in the <strong>Moments in motion</strong> strip on your public homepage — the row of travel
        images above the footer. Add your own shots here; until you do, the site shows a default set of scenic images.
      </p>
      <p className="mt-2 text-sm text-zinc-600">
        For <strong>tour package cover photos</strong>, use <strong>Tours / packages → New package</strong> (each tour has
        its own cover image).
      </p>

      <div className="mt-8">
        <GalleryManager initial={rows} />
      </div>
    </div>
  );
}
