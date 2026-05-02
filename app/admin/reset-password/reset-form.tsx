"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { completeAdminPasswordReset, type ResetRequestState } from "@/actions/admin-password-reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ResetRequestState = { ok: true, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} variant="gold">
      {pending ? "Updating…" : "Save new password"}
    </Button>
  );
}

export function AdminResetPasswordForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => sp.get("token")?.trim() ?? "", [sp]);
  const [state, action] = useFormState(completeAdminPasswordReset, initial);
  const [localErr, setLocalErr] = useState<string | null>(null);

  useEffect(() => {
    if (state?.ok && state?.message) {
      router.push("/admin/login?reset=done");
    }
  }, [state, router]);

  if (!token) {
    return (
      <div className="rounded-lg border border-amber-400/30 bg-amber-950/30 p-4 text-sm text-amber-100">
        Missing reset token. Open the link from your email or{" "}
        <Link href="/admin/forgot-password" className="underline">
          request a new one
        </Link>
        .
      </div>
    );
  }

  return (
    <form
      action={action}
      className="space-y-4"
      onSubmit={(e) => {
        setLocalErr(null);
        const fd = new FormData(e.currentTarget);
        const a = String(fd.get("password") || "");
        const b = String(fd.get("confirm") || "");
        if (a !== b) {
          e.preventDefault();
          setLocalErr("Passwords do not match.");
        }
      }}
    >
      <input type="hidden" name="token" value={token} />

      {state?.ok === false && state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {localErr ? <p className="text-sm text-red-400">{localErr}</p> : null}

      <div>
        <Label htmlFor="password" className="text-white/80">
          New password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 border-white/20 bg-white/5 text-white"
        />
      </div>
      <div>
        <Label htmlFor="confirm" className="text-white/80">
          Confirm password
        </Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 border-white/20 bg-white/5 text-white"
        />
      </div>
      <Submit />
    </form>
  );
}
