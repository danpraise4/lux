import { envFlutterwaveSecretKey } from "@/lib/server-env";

const FW_BASE = "https://api.flutterwave.com/v3";

export type FlutterwaveVerifyResult =
  | { ok: true; amount: number; currency: string; status: string; txRef: string; transactionId: number }
  | { ok: false; error: string };

/**
 * Verifies a transaction with Flutterwave (e.g. after redirect or in webhook follow-up).
 */
export async function verifyFlutterwaveTransaction(transactionId: string | number): Promise<FlutterwaveVerifyResult> {
  const secret = envFlutterwaveSecretKey();
  if (!secret) {
    return { ok: false, error: "Payment service not configured" };
  }
  const res = await fetch(`${FW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = (await res.json()) as {
    status?: string;
    message?: string;
    data?: {
      id?: number;
      status?: string;
      currency?: string;
      amount?: number;
      tx_ref?: string;
    };
  };
  if (body.status !== "success" || !body.data) {
    return { ok: false, error: body.message || "Verification failed" };
  }
  const d = body.data;
  if (d.status !== "successful") {
    return { ok: false, error: "Payment not successful" };
  }
  return {
    ok: true,
    amount: Number(d.amount || 0),
    currency: d.currency || "NGN",
    status: d.status,
    txRef: d.tx_ref || "",
    transactionId: d.id || 0,
  };
}
