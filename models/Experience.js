import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    org: String,
    category: {
      type: String,
      enum: ["Professional", "Leadership & Public Service"],
      default: "Professional"
    },
    category: {
      type: String,
      enum: ["Professional", "Leadership & Public Service"],
      default: "Professional"
    },
    date: String,
    description: String,
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
