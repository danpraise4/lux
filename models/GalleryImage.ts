import mongoose, { type InferSchemaType } from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    title: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type GalleryImage = InferSchemaType<typeof galleryImageSchema> & {
  _id: mongoose.Types.ObjectId;
};

const GalleryImageModel =
  (mongoose.models.GalleryImage as mongoose.Model<GalleryImage>) ||
  mongoose.model<GalleryImage>("GalleryImage", galleryImageSchema);

export default GalleryImageModel;
