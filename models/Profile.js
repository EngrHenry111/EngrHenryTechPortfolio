import mongoose from "mongoose";

// Single-document collection: only one Profile document should ever exist.
const ProfileSchema = new mongoose.Schema(
  {
    photo: String,
    roleLine: String,
    lede: String,
    about: String,
    quickFacts: [
      {
        k: String,
        v: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
