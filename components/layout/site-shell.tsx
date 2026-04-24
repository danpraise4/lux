import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingWidgets } from "@/components/layout/floating-widgets";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="min-w-0 pt-20 pb-24 md:pb-16 md:pt-24">{children}</div>
      <SiteFooter />
      <FloatingWidgets />
    </>
  );
}
