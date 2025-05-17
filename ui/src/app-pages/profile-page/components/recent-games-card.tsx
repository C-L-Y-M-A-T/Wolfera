"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { ChevronRight, Gamepad2, User } from "lucide-react";

interface RecentGamesCardProps {
  games: Array<{
    id: string;
    date: string;
    result: string;
    role: string;
    players: number;
  }>;
}

export function RecentGamesCard({ games }: RecentGamesCardProps) {
  const theme = useTheme();
  const { getRoleIcon, getRoleColorClass } = useRoleStyles();

  return (
    <motion.div variants={theme.variants.card}>
      <Card className={theme.gameStyles.cards.profile}>
        <CardHeader className="pb-2">
          <CardTitle
            className={`${theme.typography.fontSize.xl} ${theme.typography.textColor.accent} flex items-center`}
          >
            <Gamepad2
              className={`w-5 h-5 mr-2 ${theme.typography.textColor.accent}`}
            />
            Recent Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={theme.variants.container}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {games.map((game) => (
              <motion.div
                key={game.id}
                variants={theme.variants.item}
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden rounded-lg border border-gray-700 transition-all duration-300 hover:border-${
                  game.result === "Win" ? "green" : "red"
                }-500/50`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-800/50 " />
                <div className="relative p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full mr-3 ${getRoleColorClass(game.role)}`}
                    >
                      {getRoleIcon(game.role) || <User className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className={`font-medium flex items-center `}>
                        <span
                          className={`${getRoleColorClass(game.role)} rounded-full p-1`}
                        >
                          {game.role}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {game.players} players
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">{game.date}</div>
                    </div>
                  </div>
                  <Badge
                    variant={game.result === "Win" ? "default" : "outline"}
                    className={
                      game.result === "Win"
                        ? theme.gameStyles.badges.win
                        : theme.gameStyles.badges.loss
                    }
                  >
                    {game.result}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <Button
            variant="ghost"
            className="w-full mt-4 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            View All Games
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
