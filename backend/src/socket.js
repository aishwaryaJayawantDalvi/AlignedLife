import jwt from "jsonwebtoken";
import { Match } from "./models/Match.js";
import { Chat } from "./models/Chat.js";
import { hasSensitiveContactInfo } from "./services/moderationService.js";

export const registerSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Unauthorized"));
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      return next();
    } catch (error) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-match", async (matchId) => {
      const match = await Match.findOne({ _id: matchId, users: socket.userId });
      if (!match) return;
      socket.join(`match:${matchId}`);
    });

    socket.on("send-message", async ({ matchId, content }) => {
      if (!content?.trim()) return;
      const match = await Match.findOne({ _id: matchId, users: socket.userId });
      if (!match) return;

      const chat = await Chat.findOneAndUpdate(
        { matchId },
        { $setOnInsert: { participants: match.users } },
        { new: true, upsert: true }
      );

      const message = {
        senderId: socket.userId,
        content,
        moderationFlag: hasSensitiveContactInfo(content)
      };

      chat.messages.push(message);
      await chat.save();

      const saved = chat.messages[chat.messages.length - 1];

      io.to(`match:${matchId}`).emit("new-message", {
        ...saved.toObject(),
        warning: message.moderationFlag ? "Avoid sharing personal contact info this early." : null
      });
    });
  });
};
