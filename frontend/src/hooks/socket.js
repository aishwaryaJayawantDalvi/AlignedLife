import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  const token = localStorage.getItem("alignedlife_token");

  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000", {
      autoConnect: false,
      auth: { token }
    });
  }

  socket.auth = { token };
  if (!socket.connected) socket.connect();
  return socket;
};

export const closeSocket = () => {
  if (socket?.connected) socket.disconnect();
};
