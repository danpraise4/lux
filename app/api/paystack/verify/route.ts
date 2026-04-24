import { NextResponse } from "next/server";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ ok: true, demo: true, reference });
  }
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = (await res.json()) as {
    status?: boolean;
    data?: { status?: string; amount?: number; customer?: { email?: string } };
  };
  if (!body.status || body.data?.status !== "success") {
    return NextResponse.json({ ok: false, reference }, { status: 400 });
  }
  if (isDbConfigured()) {
    const conn = await connectDB();
    if (conn) {
      const b = await Booking.findOneAndUpdate(
        { reference },
        { status: "balance_due" },
        { new: true }
      );
      if (b) {
        await Payment.create({
          booking: b._id,
          amount: (body.data.amount || 0) / 100,
          type: "deposit",
          status: "success",
          paystackRef: reference,
          paidAt: new Date(),
        });
      }
    }
  }
  return NextResponse.json({ ok: true, reference });
}
