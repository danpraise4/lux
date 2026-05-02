"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CoverImageInput() {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setErr(data.error || "Upload failed");
        return;
      }
      setUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name="coverImage" value={url} />
      <div>
        <Label>Cover image</Label>
        <p className="mt-0.5 text-xs text-zinc-500">Upload a photo or paste a URL below.</p>
        <Input type="file" accept="image/*" className="mt-1 cursor-pointer" onChange={onFile} disabled={uploading} />
        {uploading ? <p className="mt-1 text-xs text-zinc-600">Uploading…</p> : null}
        {err ? <p className="mt-1 text-xs text-red-600">{err}</p> : null}
      </div>
      <div>
        <Label>Image URL (optional if you uploaded)</Label>
        <Input
          type="url"
          className="mt-1"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      {url ? (
        <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-lg border border-zinc-200">
          <Image src={url} alt="Cover preview" fill className="object-cover" sizes="320px" unoptimized />
        </div>
      ) : null}
    </div>
  );
}
