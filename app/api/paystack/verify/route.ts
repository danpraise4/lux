import { NextResponse } from "next/server";
import { completeDepositFromPaystackReference } from "@/lib/paystack-deposit";
import { envPaystackSecretKey } from "@/lib/server-env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!envPaystackSecretKey()) {
    return NextResponse.json({ ok: true, demo: true, reference });
  }
  await completeDepositFromPaystackReference(reference);
  return NextResponse.json({ ok: true, reference });
}
