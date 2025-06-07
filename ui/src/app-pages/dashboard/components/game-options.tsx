"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Dice1Icon as Dice,
  PlusCircle,
  Search,
} from "lucide-react";

interface GameOptionsProps {
  onCreateGame: () => void;
  onJoinById: () => void;
}

export function GameOptions({ onCreateGame, onJoinById }: GameOptionsProps) {
  const theme = useTheme();

  const getBoxShdowColor = (option: "create" | "byId" | "random") => {
    switch (option) {
      case "create":
        return "rgba(239, 68, 68, 0.2)";
      case "byId":
        return "rgba(8, 68, 239, 0.2)";
      case "random":
        return "rgba(136, 47, 215, 0.2)";
      default:
        return "rgba(239, 68, 68, 0.2)";
    }
  };

  const optionVariants = (option: "create" | "byId" | "random") => ({
    hover: {
      scale: 1.03,
      boxShadow: `0 10px 25px -5px ${getBoxShdowColor(option)}`,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  });

  return (
    <Card className={theme.gameStyles.cards.profile}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-red-400">Game Options</CardTitle>
      </CardHeader>
      <CardContent className={`${theme.typography.textColor.primary}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Create Game Option */}
          <motion.div
            variants={optionVariants("create")}
            whileHover="hover"
            whileTap="tap"
            onClick={onCreateGame}
            className="relative overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-br from-red-900/30 to-gray-800 cursor-pointer"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10] }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-4"
              >
                <PlusCircle className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold mb-2">Create Game</h3>
              <p className="text-sm text-gray-400 mb-4">
                Host your own game with custom settings
              </p>
              <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700">
                Create Game <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 w-24 h-24 bg-red-500/10 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Join Game Option */}
          <motion.div
            variants={optionVariants("byId")}
            whileHover="hover"
            whileTap="tap"
            onClick={onJoinById}
            className="relative overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-br from-blue-900/30 to-gray-800 cursor-pointer"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4"
              >
                <Search className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold mb-2">Join Game</h3>
              <p className="text-sm text-gray-400 mb-4">
                Join an existing game with a game ID
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700">
                Join by ID <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Quick Play Option - Spans full width */}
          <motion.div
            variants={optionVariants("random")}
            whileHover="hover"
            whileTap="tap"
            className="relative overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-br from-purple-900/30 to-gray-800 cursor-pointer md:col-span-2"
          >
            <div className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 360] }}
                  transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mr-4"
                >
                  <Dice className="h-8 w-8 text-white" />
                </motion.div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold mb-1">Quick Play</h3>
                  <p className="text-sm text-gray-400">
                    Join a random game instantly
                  </p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700">
                Find Match <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
