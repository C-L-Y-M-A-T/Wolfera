"use client";

import { useTheme } from "@/providers/theme-provider";
import { Clock, Moon, Sun, Vote } from "lucide-react";

interface GamePhaseIndicatorProps {
  showTitle?: boolean;
}

export function GamePhaseIndicator({
  showTitle = true,
}: GamePhaseIndicatorProps) {
  const { colors, typography } = useTheme();

  const phases = [
    {
      icon: <Moon className={`h-4 w-4 ${colors.roles.seer}`} />,
      text: "Night: Special roles act",
    },
    {
      icon: <Sun className={`h-4 w-4 ${colors.roles.hunter}`} />,
      text: "Day: Discussion & voting",
    },
    {
      icon: <Vote className={`h-4 w-4 ${colors.roles.werewolf}`} />,
      text: "Eliminate suspected werewolves",
    },
    {
      icon: <Clock className={`h-4 w-4 ${colors.roles.witch}`} />,
      text: "Survive until victory",
    },
  ];

  return (
    <div
      className={`p-4 ${colors.ui.background.secondary} rounded-lg border ${colors.ui.border.muted}`}
    >
      {showTitle && (
        <h3
          className={`text-lg font-medium ${typography.textColor.primary} mb-2`}
        >
          How to Play
        </h3>
      )}
      <p className={`text-sm ${typography.textColor.muted} mb-3`}>
        A social deduction game where villagers must find and eliminate
        werewolves before they're all eliminated.
      </p>
      <div className="grid grid-cols-2 gap-3 text-xs">
        {phases.map((phase, index) => (
          <div key={index} className="flex items-center gap-2">
            {phase.icon}
            <span className={typography.textColor.primary}>{phase.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
