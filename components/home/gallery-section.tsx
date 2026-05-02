import Image from "next/image";
import { SectionFade } from "@/components/motion/section-fade";
import { getHomeGallery } from "@/lib/data/gallery-home";

export async function GallerySection() {
  const moments = await getHomeGallery();
  return (
    <section className="bg-[#f6f2ea] py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionFade>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Gallery</p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">Moments in motion</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Smiles from the road — safaris, coastlines, and gatherings across the continent with guests who travel with
            us.
          </p>
        </SectionFade>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {moments.map((item, index) => (
            <div key={`${item.src}-${index}`} className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/10">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
