import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["open", "reviewed"], default: "open" }
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
