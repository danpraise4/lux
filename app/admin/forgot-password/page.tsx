"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { requestAdminPasswordReset, type ResetRequestState } from "@/actions/admin-password-reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ResetRequestState = { ok: true, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} variant="gold">
      {pending ? "Sending…" : "Send reset link"}
    </Button>
  );
}

export default function AdminForgotPasswordPage() {
  const [state, action] = useFormState(requestAdminPasswordReset, initial);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c0c0c] px-4 py-10 text-white">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div>
          <Link href="/admin/login" className="text-xs text-white/55 hover:text-gold">
            ← Back to sign-in
          </Link>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">NMA Luxe</p>
          <h1 className="mt-2 font-serif text-2xl">Forgot password</h1>
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            Enter the email on your staff account. If it exists, we email a one-hour link to set a new password.
          </p>
        </div>

        {!state?.ok && state?.error ? (
          <p className="text-sm text-red-400">{state.error}</p>
        ) : null}
        {state?.ok && state?.message ? (
          <p className="rounded-lg border border-emerald-400/30 bg-emerald-950/40 p-3 text-sm text-emerald-200">{state.message}</p>
        ) : null}

        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white/80">
              Work email
            </Label>
            <Input id="email" name="email" type="email" required autoComplete="email" className="mt-1 border-white/20 bg-white/5 text-white" />
          </div>
          <Submit />
        </form>
      </div>
    </div>
  );
}
