import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  reference: z.string().min(4),
  callbackUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  const raw = await request.json();
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { email, amount, reference, callbackUrl } = parsed.data;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!secret) {
    return NextResponse.json(
      {
        error: "Paystack not configured",
        demo: true,
        message: "Add PAYSTACK_SECRET_KEY to enable live payments.",
      },
      { status: 503 }
    );
  }
  const amountKobo = Math.round(amount * 100);
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl || `${siteUrl}/booking/confirmation?ref=${encodeURIComponent(reference)}`,
    }),
  });
  const data = (await res.json()) as { status?: boolean; message?: string; data?: { authorization_url?: string } };
  if (!data.status || !data.data?.authorization_url) {
    return NextResponse.json({ error: data.message || "Paystack error" }, { status: 502 });
  }
  return NextResponse.json({ authorizationUrl: data.data.authorization_url });
}
