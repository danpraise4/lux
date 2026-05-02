import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { isDbConfigured, connectDB } from "@/lib/mongodb";
import CustomTripRequest from "@/models/CustomTripRequest";
import { CustomTripReplyForm, CustomTripRequestStatusForm } from "@/components/admin/custom-trip-lead-forms";
import { ChevronLeft } from "lucide-react";
import { SITE } from "@/lib/constants";

type Props = { params: Promise<{ id: string }> };

function firstName(name: string) {
  const t = name.trim();
  if (!t) return "there";
  return t.split(/\s+/)[0] || "there";
}

export default async function AdminCustomTripDetailPage({ params }: Props) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  if (!isDbConfigured()) {
    return (
      <div>
        <p className="text-sm text-zinc-600">Database is not configured.</p>
        <Link href="/admin/custom-trips" className="mt-3 inline-block text-sm text-gold underline">
          Back to custom trip requests
        </Link>
      </div>
    );
  }

  const conn = await connectDB();
  if (!conn) {
    return (
      <div>
        <p className="text-sm text-zinc-600">Could not connect to the database.</p>
        <Link href="/admin/custom-trips" className="mt-3 inline-block text-sm text-gold underline">
          Back to custom trip requests
        </Link>
      </div>
    );
  }

  const doc = await CustomTripRequest.findById(id).lean();
  if (!doc) {
    notFound();
  }

  const created = doc.createdAt instanceof Date ? doc.createdAt : null;
  const updated = doc.updatedAt instanceof Date ? doc.updatedAt : null;
  const fn = firstName(doc.name);
  const defaultSubject = `${SITE.shortName} — Your bespoke trip brief`;

  const win =
    doc.travelStart instanceof Date && !Number.isNaN(doc.travelStart.getTime())
      ? doc.travelStart.toLocaleDateString(undefined, { dateStyle: "long" })
      : "—";
  const wend =
    doc.travelEnd instanceof Date && !Number.isNaN(doc.travelEnd.getTime())
      ? doc.travelEnd.toLocaleDateString(undefined, { dateStyle: "long" })
      : "—";

  const activityLabel =
    doc.activityLevel === "low" ? "Unhurried" : doc.activityLevel === "high" ? "Energetic" : "Balanced";

  return (
    <div className="min-w-0 max-w-3xl space-y-8">
      <div>
        <Link
          href="/admin/custom-trips"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          <ChevronLeft className="h-4 w-4" />
          All custom trip requests
        </Link>
      </div>

      <header className="space-y-2 border-b border-zinc-200 pb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Bespoke request</p>
        <h1 className="font-serif text-2xl text-zinc-900 md:text-3xl">{doc.name}</h1>
        <p className="text-sm text-zinc-600">
          Received {created ? created.toLocaleString() : "—"}
          {updated && created && updated.getTime() !== created.getTime() ? ` · Updated ${updated.toLocaleString()}` : null}
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Contact</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-zinc-500">Email</dt>
              <dd>
                <a href={`mailto:${doc.email}`} className="font-medium text-gold underline">
                  {doc.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Phone</dt>
              <dd>
                <a
                  href={`tel:${doc.phone.replace(/\s/g, "")}`}
                  className="font-medium text-zinc-900 underline-offset-2 hover:underline"
                >
                  {doc.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Pipeline</h2>
          <p className="mt-3 text-sm capitalize text-zinc-800">{doc.status}</p>
          <div className="mt-4 border-t border-zinc-100 pt-4">
            <CustomTripRequestStatusForm requestId={String(doc._id)} defaultStatus={doc.status} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Trip brief</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Destination / theme</dt>
            <dd className="font-medium text-zinc-900">{doc.destination?.trim() ? doc.destination : "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Budget</dt>
            <dd className="font-medium text-zinc-900">{doc.budget?.trim() ? doc.budget : "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Travel window</dt>
            <dd className="text-zinc-900">
              {win} – {wend}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Travelers</dt>
            <dd className="font-medium text-zinc-900">{doc.numTravelers}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Dietary</dt>
            <dd className="text-zinc-900">{doc.dietary?.trim() ? doc.dietary : "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Activity level</dt>
            <dd className="text-zinc-900">{activityLabel}</dd>
          </div>
        </dl>
        <div className="mt-4 border-t border-zinc-100 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Notes</h3>
          {doc.notes?.trim() ? (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">{doc.notes}</p>
          ) : (
            <p className="mt-2 text-sm text-zinc-500">No extra notes.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Reply by email</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Sends through your configured outbound email (Resend). Use this for proposals and detailed replies.
        </p>
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-5">
          <CustomTripReplyForm
            requestId={String(doc._id)}
            guestEmail={doc.email}
            defaultSubject={defaultSubject}
            guestFirstName={fn}
          />
        </div>
      </section>
    </div>
  );
}
