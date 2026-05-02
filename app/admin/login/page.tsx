"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function PasswordResetBanner() {
  const sp = useSearchParams();
  if (sp.get("reset") !== "done") return null;
  return (
    <p className="rounded-lg border border-emerald-400/30 bg-emerald-950/40 p-3 text-sm text-emerald-200">
      Password updated. Sign in with your new password.
    </p>
  );
}

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
          <h1 className="mt-2 font-serif text-2xl">Staff sign-in</h1>
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            Staff accounts are issued by your team. There is no self-registration on this page.
          </p>
        </div>
        <Suspense fallback={null}>
          <PasswordResetBanner />
        </Suspense>
        <div>
          <Label htmlFor="email" className="text-white/80">
            Email
          </Label>
          <Input id="email" name="email" type="email" required className="mt-1 border-white/20 bg-white/5 text-white" />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
            <Link href="/admin/forgot-password" className="text-xs text-gold hover:underline">
              Forgot password?
            </Link>
          </div>
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
