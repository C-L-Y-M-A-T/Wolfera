"use client";

// Mock user data - in a real app this would come from an API or auth context
import { useAuth } from "@/context/auth-context";
import userData from "@/data/profile/user-data.mock.json";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/providers/theme-provider";
import { gameService } from "@/services/game-service/game.service";
import type { GameSettings } from "@/types/dashboard/game-options";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AchievementShowcase,
  CreateGameModal,
  DashboardHeader,
  FriendSuggestions,
  GameGuide,
  GameOptions,
  JoinByIdModal,
  PlayerStats,
  PublicGames,
} from "./components";

export default function DashboardPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [createGameModalOpen, setCreateGameModalOpen] = useState(false);
  const [joinByIdModalOpen, setJoinByIdModalOpen] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    roles: {
      Werewolf: 1,
    },
    totalPlayers: 4,
  });
  const toast = useToast();

  const handleCreateGame = async (): Promise<void> => {
    try {
      const res = await gameService.createGame(gameSettings, user);
      router.push(`/game/${res.gameId}/lobby`);
    } catch (error) {
      console.error("Error creating game:", error);
      toast.toast({
        title: "Failed to create game",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleJoinGame = (gameId: string) => {
    console.log("Joining game:", gameId);
    // In a real app, this would join a game on the server
    // and then redirect to the waiting room
    router.push("/waiting-room");
  };

  const handleViewProfile = (userId: string) => {
    console.log("Viewing profile:", userId);
    router.push("/profile");
  };

  const handleSendFriendRequest = (userId: string) => {
    console.log("Sending friend request to:", userId);
    // In a real app, this would send a friend request
  };

  return (
    <div className={`min-h-screen ${theme.gameStyles.backgrounds.page}`}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900/95 to-gray-800/95 relative z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Dashboard Header */}
          <DashboardHeader
            user={{ ...userData, ...user }}
            notificationCount={3}
            onViewProfile={() => router.push("/profile")}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column - Game Options and Public Games */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GameOptions
                  onCreateGame={() => setCreateGameModalOpen(true)}
                  onJoinById={() => setJoinByIdModalOpen(true)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <PublicGames onJoinGame={handleJoinGame} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GameGuide />
              </motion.div>
            </div>

            {/* Right Column - Friends, Stats, Achievements */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <FriendSuggestions
                  friends={userData.friends}
                  recentPlayers={[
                    {
                      id: "rp1",
                      username: "ForestWanderer",
                      avatar: "/placeholder.svg?height=40&width=40&text=FW",
                      status: "online",
                    },
                    {
                      id: "rp2",
                      username: "MidnightHowl",
                      avatar: "/placeholder.svg?height=40&width=40&text=MH",
                      status: "offline",
                    },
                  ]}
                  onViewProfile={handleViewProfile}
                  onSendFriendRequest={handleSendFriendRequest}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PlayerStats stats={userData.stats} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <AchievementShowcase
                  achievements={userData.achievements
                    .filter((a) => a.unlocked)
                    .slice(0, 4)}
                  onViewAllAchievements={() =>
                    router.push("/profile?tab=achievements")
                  }
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateGameModal
        open={createGameModalOpen}
        onOpenChange={setCreateGameModalOpen}
        onCreateGame={handleCreateGame}
      />

      <JoinByIdModal
        open={joinByIdModalOpen}
        onOpenChange={setJoinByIdModalOpen}
        onJoinGame={handleJoinGame}
      />
    </div>
  );
}
