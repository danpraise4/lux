import mongoose, { type InferSchemaType } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["deposit", "balance", "full"], required: true },
    status: { type: String, enum: ["pending", "success", "failed", "reversed"], default: "pending" },
    paystackRef: { type: String, default: "" },
    paystackAccessCode: { type: String, default: "" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export type Payment = InferSchemaType<typeof paymentSchema> & { _id: mongoose.Types.ObjectId };

const PaymentModel =
  (mongoose.models.Payment as mongoose.Model<Payment>) ||
  mongoose.model<Payment>("Payment", paymentSchema);

export default PaymentModel;
