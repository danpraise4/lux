import { NextResponse } from "next/server";
import { completeSuccessfulGatewayPayment } from "@/lib/complete-payment";
import { envFlutterwaveWebhookSecretHash } from "@/lib/server-env";

/**
 * Flutterwave dashboard → Webhooks → URL: {NEXT_PUBLIC_SITE_URL}/api/flutterwave/webhook
 * Set "Secret hash" in Flutterwave → `FLUTTERWAVE_SECRET_HASH` or `FLUTTERWAVE_WEBHOOK_SECRET`.
 */
export async function POST(request: Request) {
  const secretHash = envFlutterwaveWebhookSecretHash();
  const verifHash = request.headers.get("verif-hash");

  const raw = await request.json().catch(() => null) as {
    event?: string;
    data?: {
      id?: number;
      tx_ref?: string;
      status?: string;
      amount?: number;
      currency?: string;
    };
  } | null;

  if (!raw?.data?.tx_ref) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (secretHash && verifHash !== secretHash) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  if (raw.event !== "charge.completed" || raw.data.status !== "successful") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const amount = Number(raw.data.amount ?? 0);
  const ref = raw.data.tx_ref;
  const txId = raw.data.id;

  if (!ref) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const result = await completeSuccessfulGatewayPayment({
    txRef: String(ref),
    amountNgn: amount,
    provider: "flutterwave",
    gatewayTransactionId: txId != null ? String(txId) : "",
  });

  if (!result.ok) {
    return NextResponse.json({ ok: true, skipped: true, reason: result.error });
  }

  return NextResponse.json({
    ok: true,
    duplicate: "duplicate" in result ? Boolean(result.duplicate) : false,
  });
}
