import Link from "next/link";
import { listSupportedLocationsForAdmin } from "@/actions/supported-locations";
import { LocationsAdmin } from "@/components/admin/locations-admin";
import { isDbConfigured } from "@/lib/mongodb";

export default async function AdminLocationsPage() {
  if (!isDbConfigured()) {
    return (
      <div>
        <h1 className="font-serif text-2xl">Tour locations</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Locations can’t be saved until your database is configured.
        </p>
        <p className="mt-2 text-sm">
          <Link className="text-gold underline" href="/admin/packages">
            Back to packages
          </Link>
        </p>
      </div>
    );
  }

  const initialLocations = await listSupportedLocationsForAdmin();

  return (
    <div>
      <h1 className="font-serif text-2xl">Tour locations</h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-600">
        Add countries and states or regions. They appear as options when you{" "}
        <Link href="/admin/packages/new" className="text-gold underline">
          create a new package
        </Link>
        .
      </p>
      <div className="mt-8">
        <LocationsAdmin initialLocations={initialLocations} />
      </div>
    </div>
  );
}
