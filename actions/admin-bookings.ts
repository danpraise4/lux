"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { syncBookingLedger } from "@/lib/booking-ledger";
import { sendTripPricingUpdatedEmail } from "@/lib/email/booking-mail";
import { generateManageToken } from "@/lib/manage-token";
import mongoose from "mongoose";
import { sendBookingStatusUpdatedEmail } from "@/lib/email/booking-mail";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Booking from "@/models/Booking";

const statuses = ["inquiry", "pending_deposit", "confirmed", "balance_due", "paid", "cancelled"] as const;

const adjustPricingSchema = z.object({
  bookingId: z.string().min(1),
  priceTotal: z.coerce.number().min(1),
  pricingNote: z.string().max(500).optional(),
});

export async function updateBookingFromForm(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const id = String(formData.get("bookingId") || "").trim();
  const statusRaw = formData.get("status");
  const statusStr = typeof statusRaw === "string" ? statusRaw.trim() : "";
  const notifyGuest = formData.get("notifyGuestStatus") === "on";

  if (!id || !mongoose.Types.ObjectId.isValid(id)) return;

  if (!isDbConfigured()) return;
  const conn = await connectDB();
  if (!conn) return;

  const statusParsed = z.enum(statuses).safeParse(statusStr);
  if (!statusParsed.success) return;

  const booking = await Booking.findById(id);
  if (!booking) return;

  const previousStatus = booking.status;
  if (previousStatus === statusParsed.data) {
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${id}`);
    return;
  }

  booking.status = statusParsed.data;
  await booking.save();

  if (notifyGuest) {
    await sendBookingStatusUpdatedEmail(booking);
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
}

export async function markBalancePaidFromForm(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const id = String(formData.get("bookingId") || "");
  if (!id) return;

  if (!isDbConfigured()) return;
  const conn = await connectDB();
  if (!conn) return;

  await Booking.updateOne({ _id: id }, { $set: { balancePaid: true, status: "paid" } });
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
}

export async function adjustBookingPricingFromForm(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;

  const parsed = adjustPricingSchema.safeParse({
    bookingId: formData.get("bookingId"),
    priceTotal: formData.get("priceTotal"),
    pricingNote: formData.get("pricingNote"),
  });
  if (!parsed.success) return;

  const notifyGuest = formData.get("notifyGuest") === "on";

  if (!isDbConfigured()) return;
  const conn = await connectDB();
  if (!conn) return;

  const booking = await Booking.findById(parsed.data.bookingId);
  if (!booking || booking.status === "cancelled") return;

  booking.priceTotal = Math.round(parsed.data.priceTotal);
  booking.pricingNoteFromAdmin = (parsed.data.pricingNote ?? "").trim().slice(0, 500);
  if (!booking.manageToken) {
    booking.manageToken = generateManageToken();
  }
  await booking.save();

  await syncBookingLedger(booking._id);

  const fresh = await Booking.findById(booking._id);
  if (fresh) {
    await sendTripPricingUpdatedEmail(fresh, { notifyGuest });
  }

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${parsed.data.bookingId}`);
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
}
