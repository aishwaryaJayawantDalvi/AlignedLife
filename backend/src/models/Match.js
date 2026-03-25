import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    compatibility: { type: Number, required: true, min: 0, max: 100 },
    revealRequests: {
      type: Map,
      of: Boolean,
      default: {}
    },
    revealed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Match = mongoose.model("Match", matchSchema);
