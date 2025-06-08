// src/context/game-context.tsx
"use client";

import { useSocket } from "@/app-pages/game/socket-context";
import {
  Channel,
  GameOptions,
  Phase,
  Player,
  PlayerVote,
} from "@/types/game/socket-payloads.types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
interface GameContextValue {
  gameId: string | null;
  players: Player[];
  owner: Player;
  activePhase: Phase | null;
  channels: Channel[];
  votes: PlayerVote[];
  gameOptions: GameOptions | null;
  gameOverMessage: string | null;
  joinGame: (user: { id: string; username: string }, gameId: string) => void;
  startGame: () => void;
  sendChatMessage: (channel: string, content: string) => void;
  submitVote: (vote: PlayerVote) => void;
  leaveGame: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const { socket, isConnected, connect, disconnect } = useSocket();

  const [players, setPlayers] = useState<Player[]>([]);
  const [owner, setOwner] = useState<Player | null>(null);

  const [activePhase, setActivePhase] = useState<Phase | null>(null);
  const [role, setRole] = useState<string>("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [werewolfVotes, setWerewolfVotes] = useState<PlayerVote[]>([]);
  const [dayVotes, setDayVotes] = useState<PlayerVote[]>([]);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

  const joinGame = (user: { id: string; username: string }, gameId: string) => {
    connect(); // Connect using SocketProvider

    if (!socket) return;

    // Set up event listeners
    socket.on("game-start", (data: IncomingGameData) => {
      setGameData(data);
    });

    socket.on("role-assigned", ({ role }: { role: string }) => {
      setRole(role);
      updatePlayerRole(user.id, role);
    });

    socket.on("phase-start", (phase: Phase) => {
      setActivePhase(phase);
    });

    socket.on("game-ended", (data: { message: string }) => {
      setGameOverMessage(data.message);
      resetGameState();
    });

    // Join the game room
    socket.emit("join_game", { userId: user.id, gameId });
  };

  const startGame = () => {
    if (socket && gameData) {
      socket.emit("player-action", {
        activePhase: "WaitingForGameStart-phase",
        timestamp: Date.now(),
        phasePayload: { action: "start-game" },
      });
    }
  };

  const leaveGame = () => {
    if (socket && gameData) {
      socket.emit("leave_game", { gameId: gameData.id });
    }
    resetGameState();
    disconnect();
  };

  // Helper functions
  const updatePlayerRole = (playerId: string, role: string) => {
    setGameData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, role } : p,
        ),
      };
    });
  };

  const resetGameState = () => {
    setGameData(null);
    setActivePhase(null);
    setRole("");
    setWerewolfVotes([]);
    setDayVotes([]);
    setChannels([]);
    setGameOverMessage(null);
  };

  useEffect(() => {
    return () => {
      if (socket) {
        // Clean up event listeners
        socket.off("game-start");
        socket.off("role-assigned");
        socket.off("phase-start");
        socket.off("game-ended");
      }
    };
  }, [socket]);

  const value = {
    gameData,
    activePhase,
    role,
    channels,
    werewolfVotes,
    dayVotes,
    gameOverMessage,
    joinGame,
    startGame,
    sendChatMessage: (channel: string, content: string) => {
      if (socket) {
        socket.emit("chat-message", {
          channel,
          content,
          id: Math.random().toString(36),
        });
      }
    },
    submitVote: (vote: PlayerVote) => {
      if (socket) {
        socket.emit("submit-vote", vote);
      }
    },
    leaveGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
