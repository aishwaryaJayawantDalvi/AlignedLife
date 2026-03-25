import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    realName: { type: String, default: "" },
    isAnonymous: { type: Boolean, default: true },
    acceptedRealityCheck: { type: Boolean, default: false },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
