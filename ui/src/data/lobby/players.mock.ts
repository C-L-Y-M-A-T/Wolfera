import { Player } from "@/types/waiting-room/player";

export const mockPlayers: Player[] = [
  {
    id: "1",
    username: "WolfHunter",
    avatar: "/placeholder.svg?height=64&width=64&text=WH",
    isHost: true,
    isReady: true,
    status: "online",
    joinedAt: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    username: "MoonHowler",
    avatar: "/placeholder.svg?height=64&width=64&text=MH",
    isHost: false,
    isReady: true,
    status: "online",
    joinedAt: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    username: "VillageProtector",
    avatar: "/placeholder.svg?height=64&width=64&text=VP",
    isHost: false,
    isReady: false,
    status: "online",
    joinedAt: new Date(Date.now() - 180000),
  },
  {
    id: "4",
    username: "NightStalker",
    avatar: "/placeholder.svg?height=64&width=64&text=NS",
    isHost: false,
    isReady: true,
    status: "online",
    joinedAt: new Date(Date.now() - 120000),
  },
];
