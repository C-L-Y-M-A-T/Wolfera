import { io, Socket } from "socket.io-client";

export const BACKEND_URL = "http://localhost:3000";

export function connectToGameSocket(username: string, gameId: string): Socket {
  return io(BACKEND_URL, {
    query: { username, gameId },
    transports: ["websocket"],
  });
}
