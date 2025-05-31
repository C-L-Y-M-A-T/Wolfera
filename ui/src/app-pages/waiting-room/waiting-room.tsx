"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  GameCountdown,
  HostNavbar,
  PlayersList,
  RolePreview,
  WaitingRoomHeader,
} from "./components";

// Mock data for the waiting room
const mockGameData = {
  gameId: "game_12345",
  gameName: "Miller's Hollow - Night Hunt",
  host: "WolfHunter",
  currentPlayer: "WolfHunter",
  maxPlayers: 12,
  minPlayers: 6,
  isHost: true,
  gameStarting: false,
  settings: {
    roles: {
      werewolves: 2,
      villagers: 6,
      seer: 1,
      doctor: 1,
      hunter: 1,
      witch: 1,
    },
    nightDuration: 60,
    dayDuration: 120,
    discussionTime: 180,
    votingTime: 60,
  },
};

const mockPlayers = [
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

export default function WaitingRoomPage() {
  const theme = useTheme();
  const [players, setPlayers] = useState(mockPlayers);
  const [gameData, setGameData] = useState(mockGameData);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Simulate players joining/leaving
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && players.length < gameData.maxPlayers) {
        // Simulate a new player joining
        const newPlayer = {
          id: `player_${Date.now()}`,
          username: `Player${Math.floor(Math.random() * 1000)}`,
          avatar: `/placeholder.svg?height=64&width=64&text=P${Math.floor(Math.random() * 100)}`,
          isHost: false,
          isReady: false,
          status: "online" as const,
          joinedAt: new Date(),
        };
        setPlayers((prev) => [...prev, newPlayer]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [players.length, gameData.maxPlayers]);

  const handleStartGame = () => {
    setCountdown(5);
    setGameData((prev) => ({ ...prev, gameStarting: true }));
  };

  const handleLeaveGame = () => {
    console.log("Leaving game...");
  };

  const handlePlayerReady = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, isReady: !player.isReady }
          : player,
      ),
    );
  };

  const allPlayersReady = players.every((player) => player.isReady);
  const canStartGame =
    players.length >= gameData.minPlayers && allPlayersReady && gameData.isHost;

  return (
    <div className={`${theme.gameStyles.backgrounds.page} pb-10`}>
      <div>
        {/* Host Navbar - Only visible to hosts */}
        {gameData.isHost && (
          <HostNavbar
            canStartGame={canStartGame}
            gameStarting={gameData.gameStarting}
            playerCount={players.length}
            minPlayers={gameData.minPlayers}
            allPlayersReady={allPlayersReady}
            onStartGame={handleStartGame}
            settings={gameData.settings}
            onSettingsChange={(newSettings) =>
              setGameData((prev) => ({ ...prev, settings: newSettings }))
            }
          />
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <WaitingRoomHeader
            gameData={gameData}
            onLeaveGame={handleLeaveGame}
          />

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 h-[calc(100vh-280px)]">
            {/* Left Column - Players List */}
            <div className="flex flex-col h-fit">
              <PlayersList
                players={players}
                maxPlayers={gameData.maxPlayers}
                currentPlayer={gameData.currentPlayer}
                onPlayerReady={handlePlayerReady}
              />
            </div>

            {/* Right Column - Role Preview */}
            <div className="flex flex-col h-full">
              <RolePreview
                settings={gameData.settings}
                playerCount={players.length}
                isExpanded={true}
                onTogglePreview={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Game Countdown Overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <GameCountdown
              countdown={countdown}
              onCountdownComplete={() => {
                setCountdown(null);
                console.log("Starting game...");
              }}
              onCountdownUpdate={setCountdown}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
