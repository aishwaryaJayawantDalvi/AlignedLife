import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    moderationFlag: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true, unique: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [messageSchema]
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
