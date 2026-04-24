import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { demoPackages, getDemoBySlug, type DemoPackage } from "@/lib/demo-packages";
import PackageModel from "@/models/Package";

export type PublicPackage = DemoPackage;

function mapDoc(p: Record<string, unknown>): PublicPackage {
  return {
    slug: String(p.slug),
    title: String(p.title),
    destination: String(p.destination),
    city: String(p.city),
    coverImage: String(p.coverImage),
    shortSummary: String(p.shortSummary),
    description: p.description != null ? String(p.description) : undefined,
    priceFrom: Number(p.priceFrom),
    durationDays: Number(p.durationDays),
    groupOrSolo: p.groupOrSolo as PublicPackage["groupOrSolo"],
    vibe: p.vibe as PublicPackage["vibe"],
    minBudget: Number(p.minBudget ?? 0),
    maxBudget: Number(p.maxBudget ?? 0),
    featured: Boolean(p.featured),
    included: (p.included as string[]) || [],
    excluded: (p.excluded as string[]) || [],
    itinerary: (p.itinerary as PublicPackage["itinerary"]) || [],
    hotelName: String(p.hotelName ?? ""),
    hotelImage: String(p.hotelImage ?? p.coverImage),
    faqs: (p.faqs as PublicPackage["faqs"]) || [],
    gallery: (p.gallery as string[]) || [],
  };
}

export async function fetchPackages(): Promise<PublicPackage[]> {
  if (!isDbConfigured()) {
    return demoPackages;
  }
  try {
    const conn = await connectDB();
    if (!conn) return demoPackages;
    const list = await PackageModel.find().sort({ createdAt: -1 }).lean();
    if (!list.length) return demoPackages;
    return list.map((d) => mapDoc(d as unknown as Record<string, unknown>));
  } catch {
    return demoPackages;
  }
}

export async function fetchPackageBySlug(slug: string): Promise<PublicPackage | null> {
  if (!isDbConfigured()) {
    return getDemoBySlug(slug) || null;
  }
  try {
    const conn = await connectDB();
    if (!conn) {
      return getDemoBySlug(slug) || null;
    }
    const p = await PackageModel.findOne({ slug }).lean();
    if (!p) {
      return getDemoBySlug(slug) || null;
    }
    return mapDoc(p as unknown as Record<string, unknown>);
  } catch {
    return getDemoBySlug(slug) || null;
  }
}

export async function fetchFeatured() {
  const all = await fetchPackages();
  return all.filter((p) => p.featured);
}
