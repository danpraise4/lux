import mongoose from "mongoose";
import { DEFAULT_DEPOSIT_PERCENT } from "@/lib/constants";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";

/**
 * Recomputes deposit line (informational), remaining balance, balancePaid, and status from
 * `booking.priceTotal` and successful payments. Call after payments or admin price changes.
 */
export async function syncBookingLedger(bookingId: mongoose.Types.ObjectId | string): Promise<void> {
  const booking = await Booking.findById(bookingId);
  if (!booking) return;

  const agg = await Payment.aggregate([
    { $match: { booking: booking._id, status: "success" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const paid = Math.round((agg[0] as { total?: number } | undefined)?.total ?? 0);
  const tripTotal = Math.round(booking.priceTotal);

  booking.depositAmount = Math.round(tripTotal * DEFAULT_DEPOSIT_PERCENT);
  const remainder = Math.max(0, tripTotal - paid);
  booking.balanceAmount = remainder;
  booking.balancePaid = tripTotal > 0 && paid >= tripTotal;

  if (booking.status === "cancelled") {
    await booking.save();
    return;
  }

  if (booking.balancePaid) {
    booking.status = "paid";
  } else if (paid > 0) {
    if (booking.status !== "confirmed") {
      booking.status = "balance_due";
    }
  }

  await booking.save();
}
