import { PackageForm } from "@/components/admin/package-form";
import { isDbConfigured } from "@/lib/mongodb";
import Link from "next/link";

export default function NewPackagePage() {
  if (!isDbConfigured()) {
    return (
      <div>
        <h1 className="font-serif text-2xl">New package</h1>
        <p className="mt-2 text-sm text-zinc-600">Set `MONGODB_URI` in your environment to enable create/update from the admin.</p>
        <p className="mt-2 text-sm">
          <Link className="text-gold underline" href="/admin/packages">
            Back to list
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="font-serif text-2xl">New package</h1>
      <div className="mt-6 max-w-xl">
        <PackageForm />
      </div>
    </div>
  );
}
