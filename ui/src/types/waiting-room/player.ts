export interface Player {
  id: string;
  username: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  status: "online" | "offline" | "in-game";
  joinedAt: Date;
}
