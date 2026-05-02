export const SITE = {
  name: "N. M. A Luxe Travel & Tour Company",
  shortName: "N. M. A Luxe",
  tagline: "Luxury Travel Experiences, Made Effortless",
  description:
    "Curated domestic and West African travel — corporate, groups, and bespoke holidays. Based in Nigeria with a luxury-first service mindset.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nmaluxe.com.ng",
  email: "hello@nmaluxe.com.ng",
  phone: "+234 805 544 7701",
  address: "Lagos, Nigeria",
  serviceCities: ["Jos", "Lagos", "Port Harcourt", "Owerri"] as const,
} as const;

export const SOCIAL = {
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  whatsapp: "https://wa.me/2348100000000",
  youtube: "https://youtube.com",
} as const;

export const DEFAULT_DEPOSIT_PERCENT = 0.65;
