import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Star } from "lucide-react";
import { fetchPackages } from "@/lib/data/packages";
import { formatNaira } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MotionCard } from "@/components/motion/motion-card";

function displayRating(slug: string) {
  const base = 4.5 + (slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 45) / 100;
  return Math.round(base * 10) / 10;
}

export default async function PopularToursSection() {
  const all = await fetchPackages();
  const tours = [...all]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.priceFrom - b.priceFrom)
    .slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-28">
      <div className="bg-topo pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">Explore our group tour packages</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-2xl leading-tight text-ink sm:text-3xl md:text-4xl lg:text-[2.5rem]">
            New and most popular tour experiences
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-border" />
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {all.length === 0 ? (
            <p className="col-span-full text-center text-sm text-muted">
              Packages will appear here once they are published.
            </p>
          ) : null}
          {tours.map((pkg) => {
            const rating = displayRating(pkg.slug);
            const fullStars = Math.floor(rating);
            return (
              <MotionCard key={pkg.slug}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-soft)]">
                  <Link href={"/packages/" + pkg.slug} className="relative block aspect-[16/10] overflow-hidden">
                    <Image
                      src={pkg.coverImage}
                      alt=""
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {pkg.featured && (
                      <Badge className="absolute left-3 top-3 shadow-sm" variant="popular">
                        Popular
                      </Badge>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col border-t border-border/60 p-5 md:p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">{pkg.destination}</p>
                    <Link href={"/packages/" + pkg.slug}>
                      <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-ink transition group-hover:text-gold-dark md:text-xl">
                        {pkg.title}
                      </h3>
                    </Link>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gold" aria-hidden />
                        {pkg.durationDays} {pkg.durationDays === 1 ? "day" : "days"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-flex gap-0.5" aria-label={`Rating ${rating} out of 5`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 shrink-0 ${i < fullStars ? "fill-gold text-gold" : "fill-transparent text-gold/25"}`}
                            />
                          ))}
                        </span>
                        <span className="text-ink/70">{rating}/5</span>
                      </span>
                    </div>
                    <div className="my-4 h-px w-full bg-border/60" />
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-wider text-muted">From</p>
                        <p className="font-serif text-xl font-semibold text-ink">{formatNaira(pkg.priceFrom)}</p>
                      </div>
                      <Link
                        href={"/packages/" + pkg.slug}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-ink underline-offset-4 transition hover:text-gold-dark hover:underline"
                      >
                        More information
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </MotionCard>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Button asChild size="lg" className="rounded-lg px-8" variant="default">
            <Link href="/packages" className="inline-flex items-center gap-2">
              View more tours
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
