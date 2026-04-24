import mongoose, { type InferSchemaType } from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    destination: { type: String, required: true },
    city: { type: String, index: true },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    shortSummary: { type: String, required: true },
    description: { type: String },
    priceFrom: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    groupOrSolo: { type: String, enum: ["group", "solo", "both"], default: "both" },
    vibe: { type: String, enum: ["adventure", "relaxation", "mixed", "cultural"], default: "mixed" },
    minBudget: { type: Number, default: 0 },
    maxBudget: { type: Number, default: 0 },
    availableDates: [{ type: Date }],
    featured: { type: Boolean, default: false },
    included: [{ type: String }],
    excluded: [{ type: String }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        body: { type: String, default: "" },
      },
    ],
    hotelName: { type: String, default: "" },
    hotelImage: { type: String, default: "" },
    faqs: [{ q: { type: String, required: true }, a: { type: String, required: true } }],
  },
  { timestamps: true }
);

export type Package = InferSchemaType<typeof packageSchema> & { _id: mongoose.Types.ObjectId };

const PackageModel =
  (mongoose.models.Package as mongoose.Model<Package>) ||
  mongoose.model<Package>("Package", packageSchema);

export default PackageModel;
