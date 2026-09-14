import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: String,
    description: String,
    image: String,
    link: String,
    repo: String,
    tech: [String],
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
