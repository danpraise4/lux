import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { PackageDetailView } from "@/components/packages/package-detail";
import { fetchPackageBySlug } from "@/lib/data/packages";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await fetchPackageBySlug(slug);
  if (!p) return { title: "Package" };
  return {
    title: p.title,
    description: p.shortSummary,
    openGraph: { title: p.title, description: p.shortSummary, images: [{ url: p.coverImage }] },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <SiteShell>
      <PackageDetailView slug={slug} />
    </SiteShell>
  );
}
