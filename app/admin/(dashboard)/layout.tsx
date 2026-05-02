import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminChrome } from "@/components/admin/admin-chrome";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  const displayName = session.user.name || session.user.email || "";

  return <AdminChrome displayName={displayName}>{children}</AdminChrome>;
}
