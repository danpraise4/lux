/**
 * @deprecated Use {@link completeSuccessfulGatewayPayment} from `./complete-payment` for new code.
 * Kept for imports that pass booking reference only (initial payments).
 */
import { completeSuccessfulGatewayPayment } from "@/lib/complete-payment";

export async function completeSuccessfulDeposit(input: {
  bookingReference: string;
  amountNgn: number;
  provider: "paystack" | "flutterwave";
  gatewayTransactionId?: string;
}): Promise<{ ok: true; duplicate?: boolean } | { ok: false; error: string }> {
  return completeSuccessfulGatewayPayment({
    txRef: input.bookingReference,
    amountNgn: input.amountNgn,
    provider: input.provider,
    gatewayTransactionId: input.gatewayTransactionId,
  });
}

export { completeSuccessfulGatewayPayment } from "@/lib/complete-payment";
