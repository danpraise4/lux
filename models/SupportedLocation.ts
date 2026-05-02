import mongoose, { type InferSchemaType } from "mongoose";

const supportedLocationSchema = new mongoose.Schema(
  {
    country: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

supportedLocationSchema.index({ country: 1, region: 1 }, { unique: true });

export type SupportedLocation = InferSchemaType<typeof supportedLocationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export function formatLocationLabel(doc: { region: string; country: string }) {
  return `${doc.region}, ${doc.country}`;
}

const SupportedLocationModel =
  (mongoose.models.SupportedLocation as mongoose.Model<SupportedLocation>) ||
  mongoose.model<SupportedLocation>("SupportedLocation", supportedLocationSchema);

export default SupportedLocationModel;
