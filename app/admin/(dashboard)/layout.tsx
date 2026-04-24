import Link from "next/link";
import { LayoutDashboard, Package, CalendarDays, Users, Building2, ImageIcon, Mail } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "../sign-out";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/crm", label: "CRM", icon: Users },
  { href: "/admin/corporate", label: "Corporate", icon: Building2 },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
] as const;

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="grid min-h-screen md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-zinc-200 bg-white md:block">
          <div className="p-4 font-serif text-lg">NMA Admin</div>
          <nav className="space-y-1 px-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="p-3">
            <SignOutButton />
          </div>
        </aside>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
