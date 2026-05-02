import mongoose, { type InferSchemaType } from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    /** SHA-256 hex of plaintext reset token (never store raw token). */
    resetTokenHash: { type: String, default: "" },
    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

adminSchema.index({ resetTokenHash: 1 }, { sparse: true });

export type Admin = InferSchemaType<typeof adminSchema> & { _id: mongoose.Types.ObjectId };

const AdminModel =
  (mongoose.models.Admin as mongoose.Model<Admin>) || mongoose.model<Admin>("Admin", adminSchema);

export default AdminModel;
