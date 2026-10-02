import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: String,
    date: String,
    description: String,
    description: String,
    link: String,
    image: String,
    sortOrder: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
