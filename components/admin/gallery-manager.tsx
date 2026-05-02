"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { addGalleryImage, removeGalleryImage, type GalleryActionState } from "@/actions/gallery-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Row = { id: string; url: string; title: string; order: number };

const addInitial: GalleryActionState = { ok: true };

function SubmitAdd() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gold" disabled={pending}>
      {pending ? "Saving…" : "Add to homepage gallery"}
    </Button>
  );
}

export function GalleryManager({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [state, formAction] = useFormState(addGalleryImage, addInitial);

  useEffect(() => {
    if (state?.ok && state.message) {
      setUrl("");
      setPublicId("");
      router.refresh();
    }
  }, [state, router]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; publicId?: string; error?: string };
      if (!res.ok || !data.url) {
        setUploadErr(data.error || "Upload didn’t work. Check image hosting is set up.");
        return;
      }
      setUrl(data.url);
      setPublicId(data.publicId || "");
    } finally {
      setUploading(false);
    }
  }

  async function onRemove(id: string) {
    if (!confirm("Remove this photo from the homepage gallery?")) return;
    await removeGalleryImage(id);
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <form action={formAction} className="max-w-xl space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="url" value={url} />
        <input type="hidden" name="publicId" value={publicId} />
        <div>
          <Label className="text-zinc-900">Photo</Label>
          <p className="mt-1 text-xs text-zinc-600">Choose an image file. It is stored securely and shown on the homepage strip.</p>
          <Input type="file" accept="image/*" className="mt-2 cursor-pointer" onChange={onFile} disabled={uploading} />
          {uploading ? <p className="mt-1 text-xs text-zinc-600">Uploading…</p> : null}
          {uploadErr ? <p className="mt-1 text-xs text-red-600">{uploadErr}</p> : null}
        </div>
        <div>
          <Label htmlFor="title" className="text-zinc-900">
            Short caption
          </Label>
          <p className="mt-1 text-xs text-zinc-600">Shown as the image description for accessibility.</p>
          <Input id="title" name="title" required minLength={2} className="mt-1" placeholder="e.g. Sunset cruise in Lagos" />
        </div>
        {url ? (
          <div className="relative h-36 w-full max-w-sm overflow-hidden rounded-lg border border-zinc-200">
            <Image src={url} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : null}
        {state?.ok === false && state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state?.ok && state.message ? <p className="text-sm text-emerald-800">{state.message}</p> : null}
        <SubmitAdd />
      </form>

      <div>
        <h2 className="font-semibold text-zinc-900">Current homepage photos</h2>
        <p className="mt-1 text-sm text-zinc-600">
          These appear in the “Moments in motion” section on your public site. Order follows the list below.
        </p>
        {initial.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            Nothing saved yet — visitors still see our default travel photos until you add one above.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
            {initial.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-zinc-100">
                  <Image src={row.url} alt="" fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-900">{row.title}</p>
                  <p className="truncate text-xs text-zinc-500">{row.url}</p>
                </div>
                <Button type="button" variant="outline" size="sm" className="text-red-700" onClick={() => onRemove(row.id)}>
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
