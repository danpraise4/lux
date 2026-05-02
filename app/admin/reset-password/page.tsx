import Link from "next/link";
import { Suspense } from "react";
import { AdminResetPasswordForm } from "./reset-form";

export default function AdminResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c0c0c] px-4 py-10 text-white">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div>
          <Link href="/admin/login" className="text-xs text-white/55 hover:text-gold">
            ← Back to sign-in
          </Link>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">NMA Luxe</p>
          <h1 className="mt-2 font-serif text-2xl">Set new password</h1>
          <p className="mt-2 text-xs leading-relaxed text-white/55">Choose a strong password — at least 8 characters.</p>
        </div>

        <Suspense fallback={<p className="text-sm text-white/60">Loading…</p>}>
          <AdminResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
