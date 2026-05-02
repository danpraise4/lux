import { completeSuccessfulGatewayPayment } from "@/lib/complete-payment";

/** Verifies a Paystack transaction and completes payment (deposit, full, or balance — idempotent). */
export async function completeDepositFromPaystackReference(reference: string): Promise<void> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !reference) return;

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = (await res.json()) as {
    status?: boolean;
    data?: { status?: string; amount?: number };
  };
  if (!body.status || body.data?.status !== "success") return;

  const amountNgn = (body.data.amount || 0) / 100;

  await completeSuccessfulGatewayPayment({
    txRef: reference,
    amountNgn,
    provider: "paystack",
  });
}
