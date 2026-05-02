import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import { fetchPackageBySlug } from "@/lib/data/packages";
import { DEFAULT_DEPOSIT_PERCENT } from "@/lib/constants";
import { makeBookingRef } from "@/lib/booking-ref";
import { generateManageToken } from "@/lib/manage-token";
import Booking from "@/models/Booking";
import PackageModel from "@/models/Package";

const bodySchema = z.object({
  packageSlug: z.string().min(1),
  startDate: z.string(),
  travelersCount: z.coerce.number().min(1).max(200),
  logistics: z.object({
    airportPickup: z.boolean(),
    cityTransfer: z.boolean(),
    flightToDeparture: z.boolean(),
    noAssistance: z.boolean(),
  }),
  leadName: z.string().min(2),
  leadEmail: z.string().email(),
  leadPhone: z.string().min(6),
  termsAccepted: z.boolean(),
  paymentChoice: z.enum(["deposit", "full"]).default("deposit"),
});

function calcPrice(pkg: { priceFrom: number }, n: number) {
  return pkg.priceFrom * n;
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const b = parsed.data;
  if (!b.termsAccepted) {
    return NextResponse.json({ error: "Accept terms" }, { status: 400 });
  }
  const pkg = await fetchPackageBySlug(b.packageSlug);
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }
  const priceTotal = calcPrice(pkg, b.travelersCount);
  const depositAmount = Math.round(priceTotal * DEFAULT_DEPOSIT_PERCENT);
  const balanceAmount = priceTotal - depositAmount;
  const reference = makeBookingRef();
  const startDate = new Date(b.startDate);
  const paymentChoice = b.paymentChoice;
  const amountDueNow = paymentChoice === "full" ? priceTotal : depositAmount;

  if (!isDbConfigured()) {
    return NextResponse.json({
      ok: true,
      reference,
      bookingId: "preview",
      depositAmount,
      balanceAmount,
      priceTotal,
      amountDueNow,
      paymentChoice,
      paystackKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
      email: b.leadEmail,
    });
  }
  const conn = await connectDB();
  if (!conn) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
  const pkgDoc = await PackageModel.findOne({ slug: pkg.slug }).select("_id").lean();
  const manageToken = generateManageToken();
  const doc = await Booking.create({
    package: pkgDoc?._id,
    packageSlug: pkg.slug,
    packageTitle: pkg.title,
    reference,
    startDate,
    travelersCount: b.travelersCount,
    logistics: b.logistics,
    leadName: b.leadName,
    leadEmail: b.leadEmail,
    leadPhone: b.leadPhone,
    termsAccepted: b.termsAccepted,
    priceTotal,
    depositAmount,
    balanceAmount,
    initialPaymentChoice: paymentChoice,
    manageToken,
    status: "pending_deposit",
  });
  return NextResponse.json({
    ok: true,
    reference,
    bookingId: doc._id.toString(),
    depositAmount,
    balanceAmount,
    priceTotal,
    amountDueNow,
    paymentChoice,
    paystackKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    email: b.leadEmail,
  });
}
