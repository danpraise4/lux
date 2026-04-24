"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setErr("Invalid email or password");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c0c0c] px-4 text-white">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">NMA Luxe</p>
          <h1 className="mt-2 font-serif text-2xl">Admin</h1>
        </div>
        <div>
          <Label htmlFor="email" className="text-white/80">
            Email
          </Label>
          <Input id="email" name="email" type="email" required className="mt-1 border-white/20 bg-white/5 text-white" />
        </div>
        <div>
          <Label htmlFor="password" className="text-white/80">
            Password
          </Label>
          <Input id="password" name="password" type="password" required className="mt-1 border-white/20 bg-white/5 text-white" />
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <Button type="submit" className="w-full" disabled={loading} variant="gold">
          {loading ? "…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
