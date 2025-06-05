"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES_DATA } from "@/data/roles";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { useTheme } from "@/providers/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";

interface RolePreviewProps {
  settings: {
    roles: {
      werewolf: number;
      villager: number;
      seer: number;
      hunter: number;
      witch: number;
    };
  };
  playerCount: number;
  isExpanded: boolean;
  onTogglePreview: () => void;
}

export function RolePreview({ settings, playerCount }: RolePreviewProps) {
  const theme = useTheme();
  const { getRoleColorClass, getRoleIcon, getRoleBorderClass } =
    useRoleStyles();
  const [showAllRoles, setShowAllRoles] = useState(false);

  const activeRoles = ROLES_DATA.filter((role) => {
    const roleKey =
      role.category === "guardian"
        ? "doctor"
        : role.category === "werewolf"
          ? "werewolves"
          : role.category === "villager"
            ? "villagers"
            : role.category;
    return settings.roles[roleKey as keyof typeof settings.roles] > 0;
  });

  const goodTeamCount = Object.entries(settings.roles).reduce(
    (sum, [role, count]) => {
      return role !== "werewolves" ? sum + count : sum;
    },
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="h-full"
    >
      <Card
        className={`${theme.gameStyles.cards.profile} h-full flex flex-col`}
      >
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-red-400 flex items-center">
              <Info className="w-5 h-5 mr-2 text-yellow-500" />
              Role Preview
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllRoles(!showAllRoles)}
              className="text-gray-400 hover:text-white"
            >
              {showAllRoles ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {/* Quick Summary */}
          <div className="flex flex-wrap gap-2 mb-6">
            {activeRoles
              .slice(0, showAllRoles ? activeRoles.length : 4)
              .map((role) => {
                const roleKey =
                  role.category === "guardian"
                    ? "doctor"
                    : role.category === "werewolf"
                      ? "werewolves"
                      : role.category === "villager"
                        ? "villagers"
                        : role.category;
                const count =
                  settings.roles[roleKey as keyof typeof settings.roles];

                return (
                  <motion.div
                    key={role.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Badge
                      variant="outline"
                      className={`${getRoleColorClass(role.category)} border ${getRoleBorderClass(role.category)}`}
                    >
                      {getRoleIcon(role.category)}
                      <span className="ml-1">
                        {role.name} ({count})
                      </span>
                    </Badge>
                  </motion.div>
                );
              })}
          </div>

          {/* Player Count Info */}
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Players in Game</span>
              <span className="font-bold text-white">{playerCount}</span>
            </div>
          </div>

          {/* Detailed Role Information */}
          <div className="space-y-4">
            <div className="text-sm text-gray-400 mb-4">
              Roles will be randomly assigned when the game starts
            </div>

            {activeRoles
              .slice(0, showAllRoles ? activeRoles.length : 3)
              .map((role, index) => {
                const roleKey =
                  role.category === "guardian"
                    ? "doctor"
                    : role.category === "werewolf"
                      ? "werewolves"
                      : role.category === "villager"
                        ? "villagers"
                        : role.category;
                const count =
                  settings.roles[roleKey as keyof typeof settings.roles];

                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getRoleColorClass(role.category)} backdrop-blur-sm ${getRoleBorderClass(role.category)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role.category)}
                        <span className="font-medium">{role.name}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            role.team === "Evil"
                              ? "bg-red-900/50 text-red-300"
                              : "bg-blue-900/50 text-blue-300"
                          }`}
                        >
                          {role.team}
                        </Badge>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-gray-800/50 text-white"
                      >
                        {count} {count === 1 ? "player" : "players"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">
                      {role.shortDescription}
                    </p>
                  </motion.div>
                );
              })}

            {/* Show More Button */}
            <AnimatePresence>
              {!showAllRoles && activeRoles.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllRoles(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    +{activeRoles.length - 3} more roles
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game Balance Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mt-6"
            >
              <div className="text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Game Balance:</span>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="text-blue-300 border-blue-500"
                    >
                      Good: {goodTeamCount}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-red-300 border-red-500"
                    >
                      Evil: {settings.roles.werewolf}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Recommended for {playerCount} players
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
