import mongoose, { type InferSchemaType } from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export type Admin = InferSchemaType<typeof adminSchema> & { _id: mongoose.Types.ObjectId };

const AdminModel =
  (mongoose.models.Admin as mongoose.Model<Admin>) || mongoose.model<Admin>("Admin", adminSchema);

export default AdminModel;
