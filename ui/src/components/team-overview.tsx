"use client";

import { getRolesByTeam } from "@/data/roles";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { useTheme } from "@/providers/theme-provider";

export function TeamOverview() {
  const { colors, typography } = useTheme();
  const { getRoleIcon } = useRoleStyles();

  const goodTeam = getRolesByTeam("Good");
  const evilTeam = getRolesByTeam("Evil");

  return (
    <div className="grid grid-cols-2 gap-4">
      <div
        className={`p-3 bg-${colors.gradients.greenToGreen}/20 border border-${colors.gradients.greenToGreen}/30 rounded-lg`}
      >
        <div className="flex items-center gap-2 mb-2">
          {getRoleIcon("Villager")}
          <span className={`font-medium ${typography.textColor.success}`}>
            Good Team
          </span>
        </div>
        <p className={`text-xs ${typography.textColor.muted}`}>
          {goodTeam.map((role) => role.name).join(", ")}
        </p>
        <p className={`text-xs ${typography.textColor.success} mt-1`}>
          Win by eliminating all werewolves
        </p>
      </div>
      <div
        className={`p-3 bg-${colors.gradients.danger}/20 border border-${typography.textColor.danger}/30 rounded-lg`}
      >
        <div className="flex items-center gap-2 mb-2">
          {getRoleIcon("Werewolf")}
          <span className={`font-medium ${typography.textColor.danger}`}>
            Evil Team
          </span>
        </div>
        <p className={`text-xs ${typography.textColor.muted}`}>
          {evilTeam.map((role) => role.name).join(", ")}
        </p>
        <p className={`text-xs ${typography.textColor.danger} mt-1`}>
          Win by equaling villager numbers
        </p>
      </div>
    </div>
  );
}
