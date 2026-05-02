import mongoose, { type InferSchemaType } from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    packageSlug: { type: String, default: "" },
    packageTitle: { type: String, default: "" },
    reference: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    travelersCount: { type: Number, required: true, min: 1 },
    travelers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Traveler" }],
    logistics: {
      airportPickup: { type: Boolean, default: false },
      cityTransfer: { type: Boolean, default: false },
      flightToDeparture: { type: Boolean, default: false },
      noAssistance: { type: Boolean, default: false },
    },
    leadName: { type: String, required: true },
    leadEmail: { type: String, required: true },
    leadPhone: { type: String, required: true },
    termsAccepted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["inquiry", "pending_deposit", "confirmed", "balance_due", "paid", "cancelled"],
      default: "pending_deposit",
    },
    priceTotal: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    balanceAmount: { type: Number, default: 0 },
    balancePaid: { type: Boolean, default: false },
    /** First checkout: pay deposit only or full trip total */
    initialPaymentChoice: { type: String, enum: ["deposit", "full"], default: "deposit" },
    /** Guest self-service link segment — unique when set */
    manageToken: { type: String, unique: true, sparse: true },
    /** Optional note from admin when trip total is revised (shown to guest in email) */
    pricingNoteFromAdmin: { type: String, default: "" },
  },
  { timestamps: true }
);

export type Booking = InferSchemaType<typeof bookingSchema> & { _id: mongoose.Types.ObjectId };

const BookingModel =
  (mongoose.models.Booking as mongoose.Model<Booking>) ||
  mongoose.model<Booking>("Booking", bookingSchema);

export default BookingModel;
