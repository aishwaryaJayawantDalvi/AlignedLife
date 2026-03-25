import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { registerSocket } from "./socket.js";

const start = async () => {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
    }
  });

  registerSocket(io);

  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
};

start().catch((error) => {
  console.error("Server start failed", error);
  process.exit(1);
});
