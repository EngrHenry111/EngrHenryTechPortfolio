import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: String,
    date: String,
    link: String,
    image: String
  },
  { timestamps: true }
);

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
