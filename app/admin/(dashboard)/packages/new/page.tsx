import { PackageForm } from "@/components/admin/package-form";
import { listSupportedLocationsForAdmin } from "@/actions/supported-locations";
import { isDbConfigured } from "@/lib/mongodb";
import Link from "next/link";

export default async function NewPackagePage() {
  if (!isDbConfigured()) {
    return (
      <div>
        <h1 className="font-serif text-2xl">New package</h1>
        <p className="mt-2 text-sm text-zinc-600">
          New packages can’t be saved until your system is fully connected. Please try again later or ask your administrator.
        </p>
        <p className="mt-2 text-sm">
          <Link className="text-gold underline" href="/admin/packages">
            Back to list
          </Link>
        </p>
      </div>
    );
  }
  const locations = await listSupportedLocationsForAdmin();
  return (
    <div>
      <h1 className="font-serif text-2xl">New package</h1>
      <div className="mt-6 max-w-xl">
        <PackageForm locations={locations} />
      </div>
    </div>
  );
}
