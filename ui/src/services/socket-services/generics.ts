import { User } from "@/types/game/player";
import { io, Socket } from "socket.io-client";

export const BACKEND_URL = "http://localhost:3000";

export function connectToGameSocket(user: User, gameId: string): Socket {
  return io(BACKEND_URL, {
    query: { userId: user.id, username: user.username, gameId },
    transports: ["websocket"],
  });
}
