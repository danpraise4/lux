import mongoose, { type InferSchemaType } from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    to: [{ type: String, required: true }],
    subject: { type: String, required: true },
    snippet: { type: String, default: "" },
    sentByEmail: { type: String, default: "" },
    ok: { type: Boolean, default: false },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);

export type EmailLog = InferSchemaType<typeof emailLogSchema> & { _id: mongoose.Types.ObjectId };

const EmailLogModel =
  (mongoose.models.EmailLog as mongoose.Model<EmailLog>) ||
  mongoose.model<EmailLog>("EmailLog", emailLogSchema);

export default EmailLogModel;
