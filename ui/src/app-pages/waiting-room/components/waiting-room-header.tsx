"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Clock, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/providers/theme-provider";
import AnimatedText from "@/components/animated-text";

interface WaitingRoomHeaderProps {
  gameData: {
    gameId: string;
    gameName: string;
    host: string;
    currentPlayer: string;
    isHost: boolean;
  };
  onLeaveGame: () => void;
}

export function WaitingRoomHeader({
  gameData,
  onLeaveGame,
}: WaitingRoomHeaderProps) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      {/* Header Card */}
      <div className={`${theme.gameStyles.cards.profile} overflow-hidden`}>
        <div
          className={`absolute inset-0 bg-gradient-to-r ${theme.gameStyles.cards.profile}`}
        />

        <div className="relative p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Game Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <AnimatedText
                  text={gameData.gameName}
                  type="werewolf"
                  className="text-2xl md:text-3xl font-bold"
                  color="text-white"
                  size="text-2xl md:text-3xl"
                  intensity="medium"
                />
                {gameData.isHost && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold">
                      <Crown className="h-3 w-3 mr-1" />
                      Host
                    </Badge>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span>Host: {gameData.host}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-green-400" />
                  <span>Game ID: {gameData.gameId}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={onLeaveGame}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Game
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated Border */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
