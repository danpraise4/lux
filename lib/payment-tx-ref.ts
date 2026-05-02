/** Appended to booking reference for Flutterwave/Paystack balance checkout (must not collide with random refs). */
export const BALANCE_TX_SUFFIX = "__BAL";

export type ParsedPaymentTxRef = { bookingReference: string; phase: "initial" | "balance" };

export function parsePaymentTxRef(txRef: string): ParsedPaymentTxRef {
  if (txRef.endsWith(BALANCE_TX_SUFFIX)) {
    return {
      bookingReference: txRef.slice(0, -BALANCE_TX_SUFFIX.length),
      phase: "balance",
    };
  }
  return { bookingReference: txRef, phase: "initial" };
}

export function balancePaymentTxRef(bookingReference: string): string {
  return `${bookingReference}${BALANCE_TX_SUFFIX}`;
}
