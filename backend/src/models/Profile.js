import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    age: { type: Number, required: true, min: 18, max: 100 },
    gender: { type: String, default: "" },
    location: { type: String, required: true },
    pressureLevel: { type: String, enum: ["Low", "Medium", "High"], required: true },
    marriageIntention: {
      type: String,
      enum: ["Do not want marriage", "Open only for social reasons"],
      required: true
    },
    kidsPreference: { type: String, enum: ["No", "Maybe later"], required: true },
    relocationWillingness: { type: String, enum: ["Yes", "No"], required: true },
    livingPreference: {
      type: String,
      enum: ["Same house", "Separate rooms", "Different cities"],
      required: true
    },
    personalityTag: { type: String, default: "Calm thinker" },
    avatarStyle: { type: String, default: "lorelei-neutral" },
    avatarSeed: { type: String, default: "alignedlife" },
    bio: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
