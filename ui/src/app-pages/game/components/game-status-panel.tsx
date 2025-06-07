"use client";

import { useRoleStyles } from "@/hooks/use-role-styles";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { Clock, Info, Target, Users } from "lucide-react";
import { GamePhase, Player } from "../game-page";

interface GameStatusPanelProps {
  currentPhase: GamePhase;
  day: number;
  roleConfig: any;
  currentPlayer?: Player;
}

export function GameStatusPanel({
  currentPhase,
  day,
  roleConfig,
  currentPlayer,
}: GameStatusPanelProps) {
  const theme = useTheme();
  const { getRoleIcon } = useRoleStyles();

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case "role-reveal":
        return "The game is starting. You are discovering your role and preparing for the night.";
      case "night":
        return "Night has fallen. Werewolves choose their victim while special roles use their abilities.";
      case "day":
        return "The village awakens to discuss the night's events. Share information and suspicions.";
      case "voting":
        return "Time to vote! Choose who you believe is a werewolf and eliminate them from the village.";
      case "results":
        return "The votes have been tallied. See who was eliminated and their true role.";
      default:
        return "Game in progress...";
    }
  };

  const getPhaseObjective = () => {
    if (!currentPlayer || !roleConfig) return null;

    switch (currentPhase) {
      case "night":
        if (roleConfig.nightAction) {
          return `Use your ${currentPlayer.role} ability to help your team.`;
        }
        return roleConfig.canSeeWerewolfChat
          ? "Observe the werewolves' discussion carefully."
          : "Rest while others take their night actions.";
      case "day":
        return "Discuss with other players to identify suspicious behavior.";
      case "voting":
        return "Vote to eliminate someone you suspect is a werewolf.";
      default:
        return null;
    }
  };

  const getRoleAdvice = () => {
    if (!currentPlayer || !roleConfig) return null;

    const advice = {
      villager: "Pay attention to voting patterns and player behavior.",
      werewolf: "Blend in with the villagers and coordinate with your pack.",
      seer: "Use your vision wisely and share information strategically.",
      doctor: "Protect key players and watch for suspicious behavior.",
      hunter: "Stay alive as long as possible to maximize your impact.",
      witch: "Save your potions for crucial moments.",
      "little-girl": "Use your observation ability to gather information.",
      cupid: "Choose lovers strategically to create interesting dynamics.",
    };

    return advice[currentPlayer.role as keyof typeof advice];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.gameStyles.cards.default} space-y-4`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Game Status</h3>
      </div>

      {/* Current Phase Info */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
          <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">Current Phase</h4>
            <p className="text-sm text-slate-300">{getPhaseDescription()}</p>
          </div>
        </div>

        {/* Role-specific objective */}
        {getPhaseObjective() && (
          <div className="flex items-start gap-3 p-3 bg-blue-950/30 rounded-lg border border-blue-800/50">
            <Target className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-300 mb-1">Your Objective</h4>
              <p className="text-sm text-blue-200">{getPhaseObjective()}</p>
            </div>
          </div>
        )}

        {/* Role advice */}
        {getRoleAdvice() && currentPlayer && (
          <div className="flex items-start gap-3 p-3 bg-purple-950/30 rounded-lg border border-purple-800/50">
            <div className="mt-0.5 text-purple-300">
              {getRoleIcon(currentPlayer.role)}
            </div>
            <div>
              <h4 className="font-medium text-purple-300 mb-1">
                Role Strategy
              </h4>
              <p className="text-sm text-purple-200">{getRoleAdvice()}</p>
            </div>
          </div>
        )}

        {/* Team info */}
        {roleConfig && (
          <div className="flex items-start gap-3 p-3 bg-green-950/30 rounded-lg border border-green-800/50">
            <Users className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-300 mb-1">Team Goal</h4>
              <p className="text-sm text-green-200">
                {roleConfig.team === "village"
                  ? "Eliminate all werewolves to win the game."
                  : "Reduce villagers to equal or fewer than werewolves."}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
