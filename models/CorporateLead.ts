import mongoose, { type InferSchemaType } from "mongoose";

const corporateLeadSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: "" },
    teamSize: { type: String, default: "" },
    status: { type: String, enum: ["new", "in_review", "won", "closed"], default: "new" },
  },
  { timestamps: true }
);

export type CorporateLead = InferSchemaType<typeof corporateLeadSchema> & {
  _id: mongoose.Types.ObjectId;
};

const CorporateLeadModel =
  (mongoose.models.CorporateLead as mongoose.Model<CorporateLead>) ||
  mongoose.model<CorporateLead>("CorporateLead", corporateLeadSchema);

export default CorporateLeadModel;
