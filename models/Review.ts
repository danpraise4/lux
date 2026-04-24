import mongoose, { type InferSchemaType } from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: "" },
    quote: { type: String, required: true },
    image: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Review = InferSchemaType<typeof reviewSchema> & { _id: mongoose.Types.ObjectId };

const ReviewModel =
  (mongoose.models.Review as mongoose.Model<Review>) ||
  mongoose.model<Review>("Review", reviewSchema);

export default ReviewModel;
