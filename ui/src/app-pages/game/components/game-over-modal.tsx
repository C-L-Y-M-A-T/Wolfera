"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRoleStyles } from "@/hooks/use-role-styles";
import type { Player } from "@/providers/game-provider";
import { motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type GameOverModalProps = {
  winner: "villagers" | "werewolves" | null;
  players: Player[];
  currentPlayerId: string;
};

export default function GameOverModal({
  winner,
  players,
  currentPlayerId,
}: GameOverModalProps) {
  const router = useRouter();
  const { getRoleBorderClass, getRoleColorClass, getRoleIcon } =
    useRoleStyles();
  const [isOpen, setIsOpen] = useState(true);

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const currentPlayerWon =
    (winner === "villagers" && currentPlayer?.role !== "werewolf") ||
    (winner === "werewolves" && currentPlayer?.role === "werewolf");

  const handleReturnHome = () => {
    router.push("/dashboard");
  };

  const handlePlayAgain = () => {
    // Logic to restart the game
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl border-none bg-black/80 p-0 text-white backdrop-blur-md">
        <div className="relative overflow-hidden rounded-lg">
          {/* Background effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${currentPlayerWon ? "from-emerald-900/50 to-teal-900/50" : "from-red-900/50 to-rose-900/50"}`}
          />

          <div className="relative z-10 p-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold">
                {winner === "villagers" ? "Villagers Win!" : "Werewolves Win!"}
              </h2>

              <p className="mt-2 text-lg">
                {currentPlayerWon
                  ? "Congratulations! Your team won!"
                  : "Better luck next time!"}
              </p>
            </motion.div>

            <div className="mt-8">
              <h3 className="mb-4 text-xl font-semibold">Player Roles</h3>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {players.map((player) => {
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: players.indexOf(player) * 0.1 }}
                      className="flex flex-col items-center rounded-lg bg-black/30 p-3 text-center"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={player.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <h4 className="mt-2 text-sm font-medium">
                        {player.name} {player.id === currentPlayerId && "(You)"}
                      </h4>

                      <div
                        className={`mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBorderClass(player.role)}`}
                      >
                        {player.role.charAt(0).toUpperCase() +
                          player.role.slice(1)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handleReturnHome}
                className="border-white/20 bg-black/30 text-white hover:bg-white/10"
              >
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>

              <Button
                onClick={handlePlayAgain}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
