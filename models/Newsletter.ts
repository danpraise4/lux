import mongoose, { type InferSchemaType } from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

export type Newsletter = InferSchemaType<typeof newsletterSchema> & {
  _id: mongoose.Types.ObjectId;
};

const NewsletterModel =
  (mongoose.models.Newsletter as mongoose.Model<Newsletter>) ||
  mongoose.model<Newsletter>("Newsletter", newsletterSchema);

export default NewsletterModel;
