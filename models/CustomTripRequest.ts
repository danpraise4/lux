import mongoose, { type InferSchemaType } from "mongoose";

const customTripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    destination: { type: String, default: "" },
    budget: { type: String, default: "" },
    travelStart: { type: Date },
    travelEnd: { type: Date },
    numTravelers: { type: Number, default: 1 },
    dietary: { type: String, default: "" },
    activityLevel: { type: String, default: "moderate" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export type CustomTripRequest = InferSchemaType<typeof customTripSchema> & {
  _id: mongoose.Types.ObjectId;
};

const CustomTripModel =
  (mongoose.models.CustomTripRequest as mongoose.Model<CustomTripRequest>) ||
  mongoose.model<CustomTripRequest>("CustomTripRequest", customTripSchema);

export default CustomTripModel;
