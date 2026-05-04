import Link from "next/link";
import { Camera, MessageCircle, MonitorPlay, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, SOCIAL } from "@/lib/constants";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const destinations = [
  "Jos",
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Owerri",
  "Ghana",
  "Benin Republic",
] as const;

const company = [
  { href: "/packages", label: "Tour Packages" },
  { href: "/custom-trip", label: "Custom Trip" },
  { href: "/corporate-travel", label: "Corporate" },
  { href: "/group-travel", label: "Group Travel" },
] as const;

const packages = [
  { href: "/packages?vibe=adventure", label: "Adventure" },
  { href: "/packages?vibe=relaxation", label: "Relaxation" },
  { href: "/packages?vibe=cultural", label: "Cultural" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface text-ink">
      <div className="grid gap-0 md:grid-cols-2">
        <div className="space-y-4 border-b border-border px-5 py-12 md:border-b-0 md:border-r md:px-10 lg:px-16">
          <h3 className="font-serif text-2xl text-ink">The NMA Notes</h3>
          <p className="text-sm text-muted max-w-md">
            Save on handpicked stays and private transport bundles. We send curated escapes — never spam.
          </p>
          <NewsletterForm />
        </div>
        <div className="space-y-4 bg-[#f6f4ef] px-5 py-12 md:px-10 lg:px-16">
          <h3 className="font-serif text-2xl">Travel Desk</h3>
          <p className="text-sm text-muted max-w-md">
            Speak to a human planner. We help with group manifests, chaperone logistics, and flexible payments.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition hover:border-gold/50 hover:text-gold-dark"
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Camera className="h-[18px] w-[18px]" />
            </a>
            <a
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition hover:border-gold/50 hover:text-gold-dark"
              href={SOCIAL.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Share2 className="h-[18px] w-[18px]" />
            </a>
            <a
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition hover:border-gold/50 hover:text-gold-dark"
              href={SOCIAL.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <MonitorPlay className="h-[18px] w-[18px]" />
            </a>
            <a
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition hover:border-gold/50 hover:text-gold-dark"
              href={SOCIAL.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
            </a>
          </div>
          <Button asChild size="lg" variant="default" className="w-full rounded-full sm:w-auto">
            <a href={SOCIAL.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <div className="mx-auto grid min-w-0 max-w-7xl gap-10 px-4 py-12 sm:py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Top destinations</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            {destinations.map((d) => (
              <li key={d}>
                <Link
                  className="hover:text-gold"
                  href={d === "Jos" ? "/packages" : "/packages?city=" + encodeURIComponent(d)}
                >
                  {d}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            {company.map((c) => (
              <li key={c.href}>
                <Link className="hover:text-gold" href={c.href}>
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="hover:text-gold" href="mailto:hello@nmaluxe.com.ng">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Experiences</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            {packages.map((c) => (
              <li key={c.label}>
                <Link className="hover:text-gold" href={c.href}>
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="hover:text-gold" href="/group-travel">
                Schools &amp; faith groups
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Visit</h4>
          <p className="text-sm text-ink/80">
            {SITE.address}
            <br />
            Serving: {SITE.serviceCities.join(" · ")}
          </p>
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="block break-words font-serif text-xl text-ink sm:text-2xl"
          >
            {SITE.phone}
          </a>
          <a
            href={`tel:${SITE.phoneSecondary.slice(1)}`}
            className="block break-words font-serif text-xl text-ink sm:text-2xl"
          >
            {SITE.phoneSecondary}
          </a>
          <a
            className="block break-all text-sm font-medium text-ink sm:break-words"
            href="mailto:hello@nmaluxe.com.ng"
          >
            hello@nmaluxe.com.ng
          </a>
        </div>
      </div>

      <div className="border-t border-gold/20 bg-ink text-white">
        <div className="mx-auto flex min-w-0 max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center text-xs text-white/80 md:flex-row md:text-left">
          <p className="max-w-prose text-pretty">
            © {new Date().getFullYear()} {SITE.name}. Crafted for Nigerian &amp; West African travel.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end md:gap-4">
            <Link className="hover:text-gold" href="#">
              Terms
            </Link>
            <Link className="hover:text-gold" href="#">
              Privacy
            </Link>
            <div className="ml-2 flex items-center gap-2">
              <a
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20"
                href={SOCIAL.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20"
                href={SOCIAL.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20"
                href={SOCIAL.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <MonitorPlay className="h-4 w-4" />
              </a>
              <a
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20"
                href={SOCIAL.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
