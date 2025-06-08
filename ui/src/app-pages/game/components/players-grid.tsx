"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { useTheme } from "@/providers/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Skull } from "lucide-react";
import { GamePhase, Player } from "../game-page";

interface PlayersGridProps {
  players: Player[];
  currentPlayer?: Player;
  selectedPlayer: string | null;
  onPlayerSelect: (playerId: string) => void;
  currentPhase: GamePhase;
  votes: Record<string, number>;
  canInteract: boolean;
}

export function PlayersGrid({
  players,
  currentPlayer,
  selectedPlayer,
  onPlayerSelect,
  currentPhase,
  votes,
  canInteract,
}: PlayersGridProps) {
  const theme = useTheme();
  const { getRoleIcon, getRoleColorClass, getRoleBorderClass } =
    useRoleStyles();

  const getPlayerCardStyle = (player: Player) => {
    let baseStyle = `${theme.gameStyles.cards.default} cursor-pointer transition-all duration-300 hover:scale-105`;

    if (player.status === "dead") {
      baseStyle += " opacity-60 grayscale";
    }

    if (player.isCurrentPlayer) {
      baseStyle += ` ${theme.gameStyles.cards.highlighted}`;
    }

    if (selectedPlayer === player.id) {
      baseStyle += " ring-2 ring-white/50 scale-105";
    }

    if (canInteract && player.status === "alive" && !player.isCurrentPlayer) {
      baseStyle += " hover:ring-2 hover:ring-blue-400/50";
    }

    return baseStyle;
  };

  const getStatusIndicator = (player: Player) => {
    if (player.status === "dead") {
      return (
        <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1">
          <Skull className="h-3 w-3 text-white" />
        </div>
      );
    }

    if (player.isCurrentPlayer) {
      return (
        <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
          <Crown className="h-3 w-3 text-white" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`${theme.gameStyles.cards.default} h-fit`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-red-400">Village Players</h2>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>
            Alive: {players.filter((p) => p.status === "alive").length}
          </span>
          <span>•</span>
          <span>Total: {players.length}</span>
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              layout
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={
                canInteract &&
                player.status === "alive" &&
                !player.isCurrentPlayer
                  ? { scale: 1.05 }
                  : {}
              }
              whileTap={
                canInteract &&
                player.status === "alive" &&
                !player.isCurrentPlayer
                  ? { scale: 0.95 }
                  : {}
              }
              className={getPlayerCardStyle(player)}
              onClick={() => {
                if (
                  canInteract &&
                  player.status === "alive" &&
                  !player.isCurrentPlayer
                ) {
                  onPlayerSelect(player.id);
                }
              }}
            >
              <div className="relative">
                <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-slate-600">
                  <AvatarImage
                    src={player.avatar || "/placeholder.svg"}
                    alt={player.name}
                  />
                  <AvatarFallback className="text-lg font-bold">
                    {player.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {getStatusIndicator(player)}

                {/* Vote count */}
                {currentPhase === "voting" && votes[player.id] && (
                  <Badge className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-600 text-white">
                    {votes[player.id]} vote{votes[player.id] !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>

              <div className="text-center">
                <h3 className="font-medium text-white mb-1 truncate">
                  {player.name}
                  {player.isCurrentPlayer && (
                    <span className="text-yellow-400 ml-1">(You)</span>
                  )}
                </h3>

                {/* Show role if revealed or current player */}
                {(player.isCurrentPlayer ||
                  (player.status === "dead" && player.isRevealed)) && (
                  <Badge
                    className={`flex items-center justify-center gap-1 text-xs ${getRoleColorClass(player.role)}`}
                  >
                    {getRoleIcon(player.role)}
                    <span>{player.role}</span>
                  </Badge>
                )}

                {/* Status indicator */}
                <div
                  className={`text-xs mt-1 ${player.status === "alive" ? "text-green-400" : "text-red-400"}`}
                >
                  {player.status === "alive" ? "Alive" : "Eliminated"}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
