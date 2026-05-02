import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { balancePaymentTxRef } from "@/lib/payment-tx-ref";

const checkoutSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  reference: z.string().min(4),
  name: z.string().optional(),
  phone: z.string().optional(),
  callbackUrl: z.string().url().optional(),
  checkoutKind: z.enum(["deposit", "full"]).optional(),
});

type CheckoutInput = {
  email: string;
  amount: number;
  reference: string;
  name?: string;
  phone?: string;
  callbackUrl?: string;
  /** Shown on Flutterwave / receipt context */
  description: string;
};

async function startGatewayCheckout(input: CheckoutInput): Promise<NextResponse> {
  const { email, amount, reference, name, phone, callbackUrl, description } = input;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const returnUrl = callbackUrl || `${siteUrl}/booking/confirmation`;

  const fwSecret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (fwSecret) {
    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${fwSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount: String(Math.round(amount)),
        currency: "NGN",
        redirect_url: returnUrl,
        customer: {
          email,
          name: name || email.split("@")[0] || "Guest",
          phonenumber: phone || "0000000000",
        },
        customizations: {
          title: "NMA Luxe",
          description,
        },
      }),
    });
    const data = (await res.json()) as {
      status?: string;
      message?: string;
      data?: { link?: string };
    };
    if (data.status === "success" && data.data?.link) {
      return NextResponse.json({ authorizationUrl: data.data.link, provider: "flutterwave" });
    }
    return NextResponse.json(
      { error: data.message || "Could not start Flutterwave checkout", provider: "flutterwave" },
      { status: 502 }
    );
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  if (paystackSecret) {
    const amountKobo = Math.round(amount * 100);
    const paystackCallback =
      callbackUrl || `${siteUrl}/booking/confirmation?ref=${encodeURIComponent(reference)}`;
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        reference,
        callback_url: paystackCallback,
      }),
    });
    const data = (await res.json()) as { status?: boolean; message?: string; data?: { authorization_url?: string } };
    if (data.status && data.data?.authorization_url) {
      return NextResponse.json({ authorizationUrl: data.data.authorization_url, provider: "paystack" });
    }
    return NextResponse.json({ error: data.message || "Paystack error", provider: "paystack" }, { status: 502 });
  }

  return NextResponse.json(
    {
      demo: true,
      message: "No payment gateway configured",
    },
    { status: 503 }
  );
}

/**
 * Initializes checkout: Flutterwave (preferred) or Paystack. Returns `authorizationUrl` to redirect the browser.
 * — Standard: email, amount, reference, optional checkoutKind (`deposit` | `full`) for labels.
 * — Balance: `manageToken` only (loads booking; tx_ref uses booking reference + balance suffix).
 */
export async function POST(request: Request) {
  const raw = await request.json();

  if (raw && typeof raw === "object" && "manageToken" in raw && typeof (raw as { manageToken?: unknown }).manageToken === "string") {
    const token = String((raw as { manageToken: string }).manageToken).trim();
    const callbackUrl =
      typeof (raw as { callbackUrl?: unknown }).callbackUrl === "string"
        ? (raw as { callbackUrl: string }).callbackUrl
        : undefined;

    if (!isDbConfigured()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const booking = await Booking.findOne({ manageToken: token });
    if (!booking) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }
    if (booking.balancePaid || booking.balanceAmount <= 0) {
      return NextResponse.json({ error: "No balance due for this booking" }, { status: 400 });
    }
    const blockedBalancePay = ["paid", "cancelled", "pending_deposit"].includes(booking.status);
    if (blockedBalancePay) {
      return NextResponse.json({ error: "Balance payment is not available for this booking" }, { status: 400 });
    }

    return startGatewayCheckout({
      email: booking.leadEmail,
      amount: booking.balanceAmount,
      reference: balancePaymentTxRef(booking.reference),
      name: booking.leadName,
      phone: booking.leadPhone,
      callbackUrl,
      description: "Trip balance",
    });
  }

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { email, amount, reference, name, phone, callbackUrl, checkoutKind } = parsed.data;
  const description =
    checkoutKind === "full" ? "Full trip payment" : checkoutKind === "deposit" ? "Trip deposit" : "Trip payment";

  return startGatewayCheckout({
    email,
    amount,
    reference,
    name,
    phone,
    callbackUrl,
    description,
  });
}
