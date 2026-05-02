import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { parsePaymentTxRef } from "@/lib/payment-tx-ref";
import { syncBookingLedger } from "@/lib/booking-ledger";
import {
  sendBalancePaidEmails,
  sendDepositConfirmationEmails,
  sendFullPaymentConfirmationEmails,
} from "@/lib/email/booking-mail";
/** Mongoose document returned by query helpers */
type BookingDoc = InstanceType<typeof Booking>;

function amountsMatch(paid: number, expected: number): boolean {
  const a = Math.round(paid);
  const b = Math.round(expected);
  return Math.abs(a - b) <= 1;
}

async function completeBalancePayment(
  booking: BookingDoc,
  input: {
    amountNgn: number;
    provider: "paystack" | "flutterwave";
    gatewayTransactionId?: string;
    txRef: string;
  }
): Promise<{ ok: true; duplicate?: boolean } | { ok: false; error: string }> {
  if (booking.balancePaid) {
    return { ok: true, duplicate: true };
  }
  if (booking.balanceAmount <= 0) {
    return { ok: false, error: "No balance due" };
  }
  if (!amountsMatch(input.amountNgn, booking.balanceAmount)) {
    return { ok: false, error: "Payment amount does not match balance due" };
  }

  const existing = await Payment.findOne({
    booking: booking._id,
    type: "balance",
    status: "success",
  });
  if (existing) {
    return { ok: true, duplicate: true };
  }

  const balanceDue = booking.balanceAmount;

  await Payment.create({
    booking: booking._id,
    amount: balanceDue,
    type: "balance",
    status: "success",
    paystackRef: input.txRef,
    provider: input.provider,
    flutterwaveTransactionId: input.gatewayTransactionId ? String(input.gatewayTransactionId) : "",
    paidAt: new Date(),
  });

  await syncBookingLedger(booking._id);
  const updated = await Booking.findById(booking._id);
  if (updated) await sendBalancePaidEmails(updated);

  return { ok: true };
}

async function completeInitialPayment(
  booking: BookingDoc,
  input: {
    amountNgn: number;
    provider: "paystack" | "flutterwave";
    gatewayTransactionId?: string;
    txRef: string;
  }
): Promise<{ ok: true; duplicate?: boolean } | { ok: false; error: string }> {
  const choice = booking.initialPaymentChoice || "deposit";

  if (choice === "full") {
    const existing = await Payment.findOne({
      booking: booking._id,
      type: "full",
      status: "success",
    });
    if (existing) {
      return { ok: true, duplicate: true };
    }
    if (!amountsMatch(input.amountNgn, booking.priceTotal)) {
      return { ok: false, error: "Payment amount does not match trip total" };
    }

    await Payment.create({
      booking: booking._id,
      amount: booking.priceTotal,
      type: "full",
      status: "success",
      paystackRef: input.txRef,
      provider: input.provider,
      flutterwaveTransactionId: input.gatewayTransactionId ? String(input.gatewayTransactionId) : "",
      paidAt: new Date(),
    });

    await syncBookingLedger(booking._id);
    const fullFresh = await Booking.findById(booking._id);
    if (fullFresh) await sendFullPaymentConfirmationEmails(fullFresh);

    return { ok: true };
  }

  const existingDeposit = await Payment.findOne({
    booking: booking._id,
    type: "deposit",
    status: "success",
  });
  if (existingDeposit) {
    return { ok: true, duplicate: true };
  }
  if (!amountsMatch(input.amountNgn, booking.depositAmount)) {
    return { ok: false, error: "Payment amount does not match deposit" };
  }

  await Payment.create({
    booking: booking._id,
    amount: booking.depositAmount,
    type: "deposit",
    status: "success",
    paystackRef: input.txRef,
    provider: input.provider,
    flutterwaveTransactionId: input.gatewayTransactionId ? String(input.gatewayTransactionId) : "",
    paidAt: new Date(),
  });

  await syncBookingLedger(booking._id);
  const depFresh = await Booking.findById(booking._id);
  if (depFresh) await sendDepositConfirmationEmails(depFresh);

  return { ok: true };
}

/**
 * Completes a gateway payment from tx_ref (initial deposit/full or balance suffix {@link BALANCE_TX_SUFFIX}).
 */
export async function completeSuccessfulGatewayPayment(input: {
  txRef: string;
  amountNgn: number;
  provider: "paystack" | "flutterwave";
  gatewayTransactionId?: string;
}): Promise<{ ok: true; duplicate?: boolean } | { ok: false; error: string }> {
  if (!isDbConfigured()) {
    return { ok: false, error: "Database not available" };
  }
  const conn = await connectDB();
  if (!conn) {
    return { ok: false, error: "Database not available" };
  }

  const { bookingReference, phase } = parsePaymentTxRef(input.txRef);
  const booking = await Booking.findOne({ reference: bookingReference });
  if (!booking) {
    return { ok: false, error: "Booking not found" };
  }

  if (phase === "balance") {
    return completeBalancePayment(booking, input);
  }
  return completeInitialPayment(booking, input);
}
