"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSubscribe } from "@/actions/newsletter";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="shrink-0" variant="default" disabled={pending}>
      {pending ? "…" : "Subscribe"}
      <ArrowUpRight className="h-4 w-4" />
    </Button>
  );
}

export function NewsletterForm() {
  const [state, formAction] = useFormState(newsletterSubscribe, { ok: false });
  if (state?.ok) {
    return (
      <p className="flex max-w-md items-center gap-2 text-sm text-gold">
        <Check className="h-4 w-4" />
        You&rsquo;re in. Watch your inbox.
      </p>
    );
  }
  return (
    <form className="flex max-w-md flex-col gap-3 sm:flex-row" action={formAction}>
      <Input name="email" type="email" required placeholder="Email address" className="h-12 flex-1" />
      <Submit />
    </form>
  );
}
