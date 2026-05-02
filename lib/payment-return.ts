import { completeSuccessfulGatewayPayment } from "@/lib/complete-payment";
import { verifyFlutterwaveTransaction } from "@/lib/flutterwave";
import { completeDepositFromPaystackReference } from "@/lib/paystack-deposit";

/**
 * After Flutterwave redirect, complete deposit if payment succeeded (idempotent).
 */
export async function verifyFlutterwaveReturn(searchParams: {
  transaction_id?: string;
  tx_ref?: string;
  status?: string;
}): Promise<void> {
  const txId = searchParams.transaction_id;
  if (!txId || searchParams.status === "cancelled") return;

  const v = await verifyFlutterwaveTransaction(txId);
  if (!v.ok) return;

  const ref = v.txRef || searchParams.tx_ref;
  if (!ref) return;

  await completeSuccessfulGatewayPayment({
    txRef: v.txRef || ref || "",
    amountNgn: v.amount,
    provider: "flutterwave",
    gatewayTransactionId: String(v.transactionId),
  });
}

/**
 * Run after returning from payment gateway (server-side on confirmation page).
 */
export async function runPaymentReturnHandlers(searchParams: Record<string, string | string[] | undefined>) {
  const g = (k: string) => {
    const v = searchParams[k];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  await verifyFlutterwaveReturn({
    transaction_id: g("transaction_id"),
    tx_ref: g("tx_ref"),
    status: g("status"),
  });

  // Paystack adds reference / trxref — avoid double-processing if Flutterwave already ran
  if (g("transaction_id")) return;

  const ref = g("ref") || g("reference") || g("trxref");
  if (ref) {
    await completeDepositFromPaystackReference(ref);
  }
}
