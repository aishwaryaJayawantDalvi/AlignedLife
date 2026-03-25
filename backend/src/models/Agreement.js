import mongoose from "mongoose";

const agreementSchema = new mongoose.Schema(
  {
    userA: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userB: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    relationshipType: {
      type: String,
      enum: ["Social marriage only", "Friendship + co-living", "Independent lives"],
      required: true
    },
    livingPlan: {
      type: String,
      enum: ["Same house / separate rooms", "Same city / different cities"],
      required: true
    },
    familyInteraction: { type: String, enum: ["High", "Medium", "Low"], required: true },
    kids: { type: String, enum: ["No", "Maybe"], required: true },
    durationType: { type: String, enum: ["Temporary", "Long-term"], required: true },
    temporaryYears: { type: Number, default: null },
    exitPlan: {
      type: String,
      default: "Either party can leave with notice. No financial dependency. Mutual respect clause."
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Agreement = mongoose.model("Agreement", agreementSchema);
