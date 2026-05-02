import Link from "next/link";
import {
  Building2,
  CalendarDays,
  CreditCard,
  Mail,
  Package,
  Plane,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { auth } from "@/auth";
import { connectDB, isDbConfigured } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import CustomTripRequest from "@/models/CustomTripRequest";
import CorporateLead from "@/models/CorporateLead";
import Newsletter from "@/models/Newsletter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";

export default async function AdminHomePage() {
  const session = await auth();
  let bookings = 0;
  let pendingBalance = 0;
  let trips = 0;
  let inquiries = 0;
  let revenue = 0;
  let newsletterSubscribers = 0;

  if (isDbConfigured()) {
    const conn = await connectDB();
    if (conn) {
      bookings = await Booking.countDocuments();
      pendingBalance = await Booking.countDocuments({ balancePaid: false, status: { $ne: "cancelled" } });
      const future = new Date();
      trips = await Booking.countDocuments({
        startDate: { $gte: future },
        status: { $in: ["confirmed", "balance_due", "paid"] },
      });
      const custom = await CustomTripRequest.countDocuments({ status: "new" });
      const corp = await CorporateLead.countDocuments({ status: { $in: ["new", "in_review"] } });
      inquiries = custom + corp;
      const payAgg = await Booking.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, t: { $sum: "$priceTotal" } } }]);
      revenue = payAgg[0]?.t || 0;
      newsletterSubscribers = await Newsletter.countDocuments();
    }
  }

  const kpi = [
    {
      label: "Total bookings",
      value: bookings,
      icon: CalendarDays,
      accent: "bg-violet-500/12 text-violet-700 ring-violet-500/20",
    },
    {
      label: "Balance due",
      value: pendingBalance,
      icon: Wallet,
      accent: "bg-amber-500/12 text-amber-800 ring-amber-500/25",
    },
    {
      label: "Upcoming trips",
      value: trips,
      icon: Plane,
      accent: "bg-sky-500/12 text-sky-800 ring-sky-500/20",
    },
    {
      label: "New inquiries",
      value: inquiries,
      icon: Sparkles,
      accent: "bg-emerald-500/12 text-emerald-800 ring-emerald-500/20",
    },
    {
      label: "Revenue",
      value: formatNaira(revenue),
      icon: TrendingUp,
      accent: "bg-gold/15 text-gold-dark ring-gold/30",
    },
    {
      label: "Newsletter subscribers",
      value: newsletterSubscribers,
      icon: Mail,
      accent: "bg-zinc-500/10 text-zinc-700 ring-zinc-500/15",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-950">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700">
            {session?.user?.name ? (
              <>
                Welcome back, <span className="font-semibold text-zinc-900">{session.user.name}</span>.
              </>
            ) : (
              "Welcome."
            )}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0 self-start sm:self-auto">
          <Link href="/admin/settings">Settings</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpi.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label} className="overflow-hidden border-zinc-200 bg-white shadow-md">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-700">{label}</CardTitle>
              <span className={cnIconBubble(accent)}>
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-zinc-950">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-200 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-950">Shortcuts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="gold" size="sm">
            <Link href="/admin/packages">
              <Package className="h-4 w-4" />
              Tours & packages
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/bookings">
              <CalendarDays className="h-4 w-4" />
              Bookings
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/payments">
              <CreditCard className="h-4 w-4" />
              Payments
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/users">
              People directory
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/emails">
              Follow-up emails
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/custom-trips">
              <Sparkles className="h-4 w-4" />
              Custom trip requests
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/corporate">
              <Building2 className="h-4 w-4" />
              Corporate leads
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function cnIconBubble(accent: string) {
  return `flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${accent}`;
}
