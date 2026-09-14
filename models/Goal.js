import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["planned", "in-progress", "done"],
      default: "planned"
    },
    targetDate: Date,
    progress: { type: Number, min: 0, max: 100, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
