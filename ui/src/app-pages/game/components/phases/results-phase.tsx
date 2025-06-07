"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRoleStyles } from "@/hooks/use-role-styles";
import type { Player } from "@/providers/game-provider";
import { useTheme } from "@/providers/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { useEffect, useState } from "react";

type ResultsPhaseProps = {
  currentPlayer: {
    id: string;
    name: string;
    role: string;
  };
  players: Player[];
  round: number;
};

export default function ResultsPhase({
  currentPlayer,
  players,
  round,
}: ResultsPhaseProps) {
  const theme = useTheme();
  const { getRoleBorderClass, getRoleColorClass, getRoleIcon } =
    useRoleStyles();

  const [showAnimation, setShowAnimation] = useState(true);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);

  // For demo purposes, we'll assume Player 6 was eliminated
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setEliminatedPlayer(players.find((p) => p.id === "6") || null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [players]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {showAnimation ? (
          <motion.div
            key="animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <FileText className="mx-auto h-20 w-20 text-emerald-400" />
            </motion.div>
            <h2 className="mt-4 text-2xl font-bold text-white">
              Tallying the Votes...
            </h2>
          </motion.div>
        ) : eliminatedPlayer ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md rounded-xl bg-black/40 p-8 text-center backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white">
              The Village Has Decided
            </h2>

            <div className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Avatar className="mx-auto h-24 w-24 border-4 border-red-800">
                  <AvatarImage
                    src={eliminatedPlayer.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-2xl font-bold">
                    {eliminatedPlayer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="mt-4 text-xl font-medium text-white">
                  {eliminatedPlayer.name}
                </h3>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <p className="mt-2 text-gray-300">
                    has been eliminated by the village.
                  </p>

                  <div className="mt-6">
                    <p className="text-sm text-gray-400">Their role was</p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.5 }}
                      className="mt-2"
                    >
                      {eliminatedPlayer.role && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-6 w-6">
                            {getRoleIcon(eliminatedPlayer.role)}
                          </div>

                          <span
                            className={`text-xl font-bold ${getRoleColorClass(eliminatedPlayer.role)}`}
                          >
                            {eliminatedPlayer.role.charAt(0).toUpperCase() +
                              eliminatedPlayer.role.slice(1)}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
              className="mt-8"
            >
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
                Continue to Night Phase
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="no-elimination"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white">
              No Elimination Today
            </h2>
            <p className="mt-2 text-gray-300">
              The village was unable to reach a decision.
            </p>

            <Button className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
              Continue to Night Phase
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
