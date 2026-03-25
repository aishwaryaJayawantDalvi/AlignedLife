import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import agreementRoutes from "./routes/agreementRoutes.js";
import moderationRoutes from "./routes/moderationRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/matches", matchRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/agreements", agreementRoutes);
  app.use("/api/moderation", moderationRoutes);

  app.use(errorHandler);

  return app;
};
