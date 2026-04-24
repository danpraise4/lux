import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { HomeHero } from "@/components/home/hero";
import { IntroStrip } from "@/components/home/intro-strip";
import PopularToursSection from "@/components/home/popular-tours";
import { FeaturedDestinations } from "@/components/home/featured-destinations";
import { WhyChoose } from "@/components/home/why-choose";
import {
  WeekendEscapes,
  CorporateBlock,
  GroupTravelBlock,
} from "@/components/home/weekend-corporate-group";
import { Testimonials } from "@/components/home/testimonials";
import { GallerySection } from "@/components/home/gallery-section";
import { FinalCta } from "@/components/home/final-cta";
import { SITE } from "@/lib/constants";

/** Refreshes homepage tour grid when packages change in MongoDB */
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Luxury travel & curated tours in Nigeria & West Africa",
  description: `${SITE.name} — ${SITE.description}`,
  openGraph: { title: SITE.name, description: SITE.description, url: SITE.url },
};

export default function HomePage() {
  return (
    <SiteShell>
      <HomeHero />
      <IntroStrip />
      <PopularToursSection />
      <FeaturedDestinations />
      <WhyChoose />
      <WeekendEscapes />
      <CorporateBlock />
      <GroupTravelBlock />
      <Testimonials />
      <GallerySection />
      <FinalCta />
    </SiteShell>
  );
}
