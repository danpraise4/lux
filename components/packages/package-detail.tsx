import Image from "next/image";
import Link from "next/link";
import { Star, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { notFound } from "next/navigation";
import { fetchPackageBySlug, fetchPackages } from "@/lib/data/packages";
import { SectionFade } from "@/components/motion/section-fade";
import { MotionCard } from "@/components/motion/motion-card";

type Props = { slug: string };

export async function PackageDetailView({ slug }: Props) {
  const pkg = await fetchPackageBySlug(slug);
  if (!pkg) notFound();
  const all = await fetchPackages();
  const similar = all.filter((p) => p.slug !== pkg.slug).slice(0, 3);

  return (
    <div className="bg-surface">
      <div className="relative h-[min(50vh,28rem)] min-h-[280px] w-full sm:min-h-[320px] md:h-[55vh] md:min-h-[360px]">
        <Image src={pkg.coverImage} alt={pkg.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-6 text-white sm:pb-8 md:px-6 md:pb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{pkg.destination}</p>
          <h1 className="mt-2 max-w-3xl font-serif text-2xl leading-tight sm:text-3xl md:text-5xl">{pkg.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/85">
            <span className="inline-flex items-center gap-1">
              <Timer className="h-4 w-4 text-gold" />
              {pkg.durationDays} days
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-gold" />
              From {formatNaira(pkg.priceFrom)} / person
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto min-w-0 max-w-7xl space-y-12 px-4 py-10 sm:space-y-16 sm:py-12 md:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <SectionFade>
              <h2 className="font-serif text-2xl text-ink">Overview</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{pkg.shortSummary}</p>
            </SectionFade>
            {pkg.description && (
              <SectionFade>
                <p className="text-sm leading-relaxed text-muted">{pkg.description}</p>
              </SectionFade>
            )}

            <SectionFade>
              <h2 className="font-serif text-2xl text-ink">Itinerary</h2>
              <div className="mt-4 space-y-0 border-l-2 border-gold/30 pl-6">
                {pkg.itinerary.map((d) => (
                  <div key={d.day} className="relative pb-8">
                    <span className="absolute -left-[calc(0.5rem+2px)] top-0 flex h-3 w-3 -translate-x-1/2 rounded-full border-2 border-gold bg-surface" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold">Day {d.day}</p>
                    <h3 className="font-serif text-lg text-ink">{d.title}</h3>
                    {d.body && <p className="mt-1 text-sm text-muted">{d.body}</p>}
                  </div>
                ))}
              </div>
            </SectionFade>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-serif text-lg">Included</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {pkg.included.map((x) => (
                      <li key={x}>· {x}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-serif text-lg">Not included</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {pkg.excluded.length ? (
                      pkg.excluded.map((x) => <li key={x}>· {x}</li>)
                    ) : (
                      <li className="text-sm text-muted/80">As confirmed in your quote</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-gold/20">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wider text-muted">From</p>
                <p className="mt-1 break-words font-serif text-2xl text-ink sm:text-3xl">{formatNaira(pkg.priceFrom)}</p>
                <p className="text-sm text-gold">Per person, shared twin where noted</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button asChild className="w-full rounded-full" size="lg" variant="gold">
                    <Link href={"/booking?package=" + encodeURIComponent(pkg.slug)}>Book with deposit</Link>
                  </Button>
                  <Button asChild className="w-full rounded-full" variant="outline">
                    <Link href="/custom-trip">Tweak as custom</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            {pkg.hotelName && (
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={pkg.hotelImage} alt={pkg.hotelName} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif text-lg">Stay preview</h3>
                  <p className="text-sm text-muted">{pkg.hotelName}</p>
                </CardContent>
              </Card>
            )}

            <SectionFade>
              <h2 className="font-serif text-xl">Available dates</h2>
              <p className="mt-2 text-sm text-muted">
                Core dates are released monthly. For private blocks or groups, the desk will hold inventory after
                your deposit.
              </p>
            </SectionFade>
          </div>
        </div>

        {!!pkg.faqs.length && (
          <SectionFade>
            <h2 className="font-serif text-2xl">FAQs</h2>
            <div className="mt-4 space-y-3">
              {pkg.faqs.map((f) => (
                <Card key={f.q}>
                  <CardContent className="p-4">
                    <p className="font-medium text-ink">{f.q}</p>
                    <p className="mt-1 text-sm text-muted">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionFade>
        )}

        {similar.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl">You may also like</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {similar.map((p) => (
                <MotionCard key={p.slug}>
                  <Link href={"/packages/" + p.slug} className="block">
                    <div className="relative h-40 overflow-hidden rounded-2xl border">
                      <Image src={p.coverImage} alt="" fill className="object-cover" />
                    </div>
                    <p className="mt-2 font-serif text-lg">{p.title}</p>
                    <p className="text-sm text-gold-dark">{formatNaira(p.priceFrom)}</p>
                  </Link>
                </MotionCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
