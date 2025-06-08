"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Player, PlayerRole } from "../game-page";

interface RoleActionModalProps {
  role: PlayerRole;
  players: Player[];
  onComplete: (result: any) => void;
}

export function RoleActionModal({
  role,
  players,
  onComplete,
}: RoleActionModalProps) {
  const { getRoleIcon, getRoleColorClass } = useRoleStyles();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const getRoleActionTitle = () => {
    switch (role) {
      case "seer":
        return "Seer Vision";
      case "doctor":
        return "Protect Someone";
      case "werewolf":
        return "Choose Victim";
      case "witch":
        return "Use Potion";
      case "cupid":
        return "Choose Lovers";
      default:
        return "Night Action";
    }
  };

  const getRoleActionDescription = () => {
    switch (role) {
      case "seer":
        return "Choose a player to reveal their role";
      case "doctor":
        return "Choose a player to protect from werewolf attacks";
      case "werewolf":
        return "Choose a player to eliminate";
      case "witch":
        return "Choose how to use your potions";
      case "cupid":
        return "Choose two players to become lovers";
      default:
        return "Choose your night action";
    }
  };

  const handleConfirm = () => {
    if (selectedPlayer) {
      onComplete({ targetId: selectedPlayer, action: role });
    }
  };

  const handleCancel = () => {
    onComplete({ cancelled: true });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={getRoleColorClass(role)}>{getRoleIcon(role)}</div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {getRoleActionTitle()}
                </h2>
                <p className="text-slate-400">{getRoleActionDescription()}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {players.map((player) => (
              <motion.div
                key={player.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPlayer(player.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPlayer === player.id
                    ? "border-blue-500 bg-blue-950/30"
                    : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                }`}
              >
                <Avatar className="w-12 h-12 mx-auto mb-2">
                  <AvatarImage src={player.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-center text-sm font-medium text-white">
                  {player.name}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedPlayer}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Action
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
