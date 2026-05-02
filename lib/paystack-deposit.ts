import { completeSuccessfulGatewayPayment } from "@/lib/complete-payment";
import { envPaystackSecretKey } from "@/lib/server-env";

/** Verifies a Paystack transaction and completes payment (deposit, full, or balance — idempotent). */
export async function completeDepositFromPaystackReference(reference: string): Promise<void> {
  const secret = envPaystackSecretKey();
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
