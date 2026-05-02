"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  CreditCard,
  UsersRound,
  Users,
  Building2,
  ImageIcon,
  Mail,
  Send,
  Settings,
  PanelLeftClose,
  Menu,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "@/components/admin/user-menu";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Tours / packages", icon: Package },
  { href: "/admin/locations", label: "Tour locations", icon: MapPin },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/users", label: "People & subscribers", icon: UsersRound },
  { href: "/admin/crm", label: "CRM inbox", icon: Users },
  { href: "/admin/custom-trips", label: "Custom trips", icon: Sparkles },
  { href: "/admin/corporate", label: "Corporate", icon: Building2 },
  { href: "/admin/gallery", label: "Homepage gallery", icon: ImageIcon },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/emails", label: "Follow-up emails", icon: Send },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function navActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function pageTitle(pathname: string) {
  const item = nav.find((n) => navActive(pathname, n.href));
  return item?.label ?? "Dashboard";
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1 px-2">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = navActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-gold/12 font-medium text-gold-dark shadow-sm ring-1 ring-gold/25"
                : "text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", active ? "text-gold-dark" : "text-zinc-600")} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminChrome({
  displayName,
  children,
}: {
  displayName: string | null | undefined;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = pageTitle(pathname);
  const name = displayName?.trim() || "Administrator";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="relative z-20 hidden min-h-0 w-[260px] shrink-0 flex-col border-r border-zinc-200 bg-white shadow-sm md:flex">
          <div className="flex h-14 items-center border-b border-zinc-200 px-5">
            <Link href="/admin" className="font-semibold tracking-tight text-zinc-950">
              NMA Luxe
            </Link>
            <span className="ml-2 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-700">
              Admin
            </span>
          </div>
          <ScrollArea className="min-h-0 flex-1 py-4">
            <SidebarNav />
          </ScrollArea>
          <div className="border-t border-zinc-200 bg-zinc-50/80 p-4">
            <p className="truncate text-xs font-medium text-zinc-600">Signed in as</p>
            <p className="truncate text-sm font-semibold text-zinc-900">{name}</p>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 shadow-sm md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 md:hidden" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex w-[min(100vw-1rem,18rem)] flex-col p-0">
                  <SheetHeader className="border-b border-zinc-200 px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <PanelLeftClose className="h-5 w-5 text-zinc-600" aria-hidden />
                      <SheetTitle className="text-base font-semibold text-zinc-950">Navigation</SheetTitle>
                    </div>
                  </SheetHeader>
                  <ScrollArea className="flex-1 py-3">
                    <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
                  </ScrollArea>
                  <div className="border-t border-zinc-200 bg-zinc-50 p-4 text-xs font-medium text-zinc-700">
                    <p className="truncate">{name}</p>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold tracking-tight text-zinc-950 md:text-xl">{title}</p>
              </div>
            </div>

            <UserMenu displayName={name} />
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
