import { IMG } from "@/lib/site-images";

export type DemoPackage = {
  slug: string;
  title: string;
  destination: string;
  city: string;
  coverImage: string;
  shortSummary: string;
  description?: string;
  priceFrom: number;
  durationDays: number;
  groupOrSolo: "group" | "solo" | "both";
  vibe: "adventure" | "relaxation" | "mixed" | "cultural";
  minBudget: number;
  maxBudget: number;
  featured: boolean;
  included: string[];
  excluded: string[];
  itinerary: { day: number; title: string; body: string }[];
  hotelName: string;
  hotelImage: string;
  faqs: { q: string; a: string }[];
  gallery: string[];
};

export const demoPackages: DemoPackage[] = [
  {
    slug: "plateau-escape",
    title: "Jos – Highland Luxury Weekend",
    destination: "Jos",
    city: "Jos",
    coverImage: IMG.jos,
    shortSummary: "Misty hills, crisp air, and curated heritage stops — a refined Plateau experience.",
    priceFrom: 420000,
    durationDays: 3,
    groupOrSolo: "both",
    vibe: "mixed",
    minBudget: 300000,
    maxBudget: 800000,
    featured: true,
    included: [
      "Airport or city meet & greet",
      "Boutique lodge accommodation (twin share)",
      "Private guide on selected days",
    ],
    excluded: [
      "International or domestic flights (unless add-on selected)",
      "Personal travel insurance",
    ],
    itinerary: [
      { day: 1, title: "Arrival & welcome", body: "Private transfer, evening sunset viewpoint." },
      { day: 2, title: "Cultural & nature loop", body: "Guided heritage visit and scenic drive." },
      { day: 3, title: "Brunch & departure", body: "Relaxed morning before your onward travel." },
    ],
    hotelName: "Boutique highland stay",
    hotelImage: IMG.lifestyle,
    faqs: [
      { q: "Is this suitable for first-time visitors to Jos?", a: "Yes — pacing is flexible with premium support." },
      { q: "Can we add extra nights?", a: "Absolutely. Request this in a custom plan or with our team at booking." },
    ],
    gallery: [IMG.landscapeWide],
  },
  {
    slug: "lagos-coastal-charm",
    title: "Lagos – Coastal & City Blend",
    destination: "Lagos",
    city: "Lagos",
    coverImage: IMG.landscapeWide,
    shortSummary: "Seaside calm meets elevated dining — a Lagos long weekend for discerning guests.",
    priceFrom: 580000,
    durationDays: 4,
    groupOrSolo: "both",
    vibe: "relaxation",
    minBudget: 450000,
    maxBudget: 1200000,
    featured: true,
    included: [
      "Curated art & design district experience",
      "Seaside table reservation assistance",
    ],
    excluded: ["Flights to Lagos (optional add-on)"],
    itinerary: [
      { day: 1, title: "Arrive & reset", body: "Airport or city handoff and evening at leisure." },
      { day: 2, title: "Lagos in focus", body: "Private city rhythm — culture and culinary highlights." },
    ],
    hotelName: "Boutique waterfront property",
    hotelImage: IMG.coastal,
    faqs: [
      { q: "Is airport pickup available?", a: "Yes, include it in the booking logistics step." },
    ],
    gallery: [IMG.landscapeHero],
  },
  {
    slug: "ph-rivers-retreat",
    title: "Port Harcourt – Garden City Escape",
    destination: "Port Harcourt",
    city: "Port Harcourt",
    coverImage: IMG.portHarcourtBeach,
    shortSummary: "Lush green scenery and relaxed pacing — a sophisticated Garden City long weekend.",
    priceFrom: 380000,
    durationDays: 3,
    groupOrSolo: "group",
    vibe: "relaxation",
    minBudget: 280000,
    maxBudget: 700000,
    featured: false,
    included: ["Dedicated trip manager", "Curated local dining recommendations"],
    excluded: ["Visa support if required"],
    itinerary: [
      { day: 1, title: "Welcome in PH", body: "Smooth arrival and evening unwind." },
    ],
    hotelName: "Premium city hotel",
    hotelImage: IMG.lifestyle,
    faqs: [{ q: "Group discounts?", a: "Yes for schools, churches, and organizations — see Group Travel page." }],
    gallery: [],
  },
  {
    slug: "owerri-cultural-weekend",
    title: "Owerri – Calm & Culture",
    destination: "Owerri",
    city: "Owerri",
    coverImage: IMG.landscapeHero,
    shortSummary: "Food-forward stops and unhurried discovery — a gentle introduction to the region.",
    priceFrom: 350000,
    durationDays: 2,
    groupOrSolo: "both",
    vibe: "mixed",
    minBudget: 250000,
    maxBudget: 600000,
    featured: true,
    included: ["Curated day plan", "Evening experience coordination"],
    excluded: ["Optional spa add-ons"],
    itinerary: [
      { day: 1, title: "Arrive & explore", body: "Evening at leisure with our suggestions." },
    ],
    hotelName: "Curated 4–5★ stay",
    hotelImage: IMG.coastal,
    faqs: [],
    gallery: [],
  },
  {
    slug: "ghana-beyond",
    title: "Ghana – Heritage Highlights",
    destination: "Ghana",
    city: "Lagos",
    coverImage: IMG.landscapeHero,
    shortSummary: "Coastal forts, rhythm, and refined pacing — a regional experience that feels first-class.",
    priceFrom: 1250000,
    durationDays: 6,
    groupOrSolo: "both",
    vibe: "cultural",
    minBudget: 1000000,
    maxBudget: 3500000,
    featured: true,
    included: ["Cross-border support planning", "Handpicked stays"],
    excluded: ["Personal spending"],
    itinerary: [
      { day: 1, title: "Crossing & reset", body: "Smooth transfer and first evening in Accra." },
    ],
    hotelName: "Boutique Accra / Cape stay",
    hotelImage: IMG.portHarcourtBeach,
    faqs: [],
    gallery: [],
  },
  {
    slug: "benin-republic-luxe",
    title: "Benin Republic – Coastal Serenity",
    destination: "Benin Republic",
    city: "Lagos",
    coverImage: IMG.coastal,
    shortSummary: "A calm regional escape with ocean breeze and unhurried days.",
    priceFrom: 520000,
    durationDays: 4,
    groupOrSolo: "both",
    vibe: "relaxation",
    minBudget: 400000,
    maxBudget: 1500000,
    featured: true,
    included: ["Border-crossing support notes", "Local hosts"],
    excluded: ["Passport/visa where applicable — we advise, you arrange"],
    itinerary: [
      { day: 1, title: "Departure from Lagos", body: "Coordinated start with optional group manifest." },
    ],
    hotelName: "Boutique coastal stay",
    hotelImage: IMG.landscapeWide,
    faqs: [],
    gallery: [],
  },
  {
    slug: "abuja-executive",
    title: "Abuja – Executive Long Weekend",
    destination: "Abuja",
    city: "Lagos",
    coverImage: IMG.landscapeWide,
    shortSummary: "Spacious boulevards, world-class dining, and calm pacing for busy leaders.",
    priceFrom: 480000,
    durationDays: 3,
    groupOrSolo: "both",
    vibe: "mixed",
    minBudget: 350000,
    maxBudget: 900000,
    featured: true,
    included: ["Itinerary tailored to your pace", "Concierge for dining"],
    excluded: ["Flights to Abuja"],
    itinerary: [
      { day: 1, title: "Arrive Abuja", body: "Meet & greet, evening at leisure." },
    ],
    hotelName: "Premium central hotel",
    hotelImage: IMG.lifestyle,
    faqs: [],
    gallery: [],
  },
];

export function getDemoBySlug(slug: string) {
  return demoPackages.find((p) => p.slug === slug);
}

export function getFeaturedDemo() {
  return demoPackages.filter((p) => p.featured);
}
