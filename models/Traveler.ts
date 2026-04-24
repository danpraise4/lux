import mongoose, { type InferSchemaType } from "mongoose";

const travelerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date },
    idNumber: { type: String, default: "" },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  },
  { timestamps: true }
);

export type Traveler = InferSchemaType<typeof travelerSchema> & { _id: mongoose.Types.ObjectId };

const TravelerModel =
  (mongoose.models.Traveler as mongoose.Model<Traveler>) ||
  mongoose.model<Traveler>("Traveler", travelerSchema);

export default TravelerModel;
