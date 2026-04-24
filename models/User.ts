import mongoose, { type InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;
