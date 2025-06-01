"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { Eye, Trophy } from "lucide-react";

interface StatsCardProps {
  stats: {
    gamesPlayed: number;
    wins: number;
    winRate: string;
    favoriteRole: string;
    killCount: number;
    survivedNights: number;
  };
}

export function StatsCard({ stats }: StatsCardProps) {
  const theme = useTheme();

  return (
    <motion.div variants={theme.variants.card}>
      <Card className={theme.gameStyles.cards.profile}>
        <CardHeader className="pb-2">
          <CardTitle className={`text-xl text-red-500 flex items-center`}>
            <Trophy className="w-5 h-5 mr-2 text-red-500" />
            Player Stats
          </CardTitle>
        </CardHeader>
        <CardContent className={`${theme.typography.textColor.primary}`}>
          <div className="space-y-4">
            <motion.div
              variants={theme.variants.item}
              className="grid grid-cols-2 gap-4"
            >
              {/* Stats grid */}
              <div className={theme.gameStyles.cards.stat}>
                <div className="text-xs text-gray-500 mb-1">Games Played</div>
                <div className="text-xl font-bold">{stats.gamesPlayed}</div>
              </div>

              <div className={theme.gameStyles.cards.stat}>
                <div className="text-xs text-gray-500 mb-1">Win Rate</div>
                <div className="text-xl font-bold text-green-400">
                  {stats.winRate}
                </div>
              </div>

              <div className={theme.gameStyles.cards.stat}>
                <div className="text-xs text-gray-500 mb-1">Kills</div>
                <div className="text-xl font-bold text-red-400">
                  {stats.killCount}
                </div>
              </div>

              <div className={theme.gameStyles.cards.stat}>
                <div className="text-xs text-gray-500 mb-1">
                  Nights Survived
                </div>
                <div className="text-xl font-bold text-blue-400">
                  {stats.survivedNights}
                </div>
              </div>
            </motion.div>

            <motion.div variants={theme.variants.item}>
              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2">Favorite Role</div>
                <div className="flex items-center p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <div className="bg-purple-500/20 p-2 rounded-full mr-3">
                    <Eye className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-bold text-purple-400">
                      {stats.favoriteRole}
                    </div>
                    <div className="text-xs text-gray-400">
                      Most played role
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
