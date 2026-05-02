import { NextResponse } from "next/server";
import { completeDepositFromPaystackReference } from "@/lib/paystack-deposit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ ok: true, demo: true, reference });
  }
  await completeDepositFromPaystackReference(reference);
  return NextResponse.json({ ok: true, reference });
}
