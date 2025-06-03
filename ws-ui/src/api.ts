import { io, Socket } from "socket.io-client";
import { User } from "./types";

export const BACKEND_URL = "http://localhost:3000";

export function connectToGameSocket(user: User, gameId: string): Socket {
  return io(BACKEND_URL, {
    query: { userId: user.id, username: user.username, gameId },
    transports: ["websocket"],
  });
}
