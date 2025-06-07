"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { Activity, Eye, Shield, Skull, Trophy } from "lucide-react";

interface PlayerStatsProps {
  stats: {
    gamesPlayed: number;
    wins: number;
    winRate: string;
    favoriteRole: string;
    killCount: number;
    survivedNights: number;
  };
}

export function PlayerStats({ stats }: PlayerStatsProps) {
  const theme = useTheme();

  return (
    <Card className={theme.gameStyles.cards.profile}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-red-400 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-purple-600" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent className={`${theme.typography.textColor.primary}`}>
        <div className="space-y-4">
          {/* Win Rate Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Win Rate</span>
              <span className="font-medium text-green-400">
                {stats.winRate}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: stats.winRate }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-green-600 to-green-700"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={theme.gameStyles.cards.stat}
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <div className="text-xs text-gray-400">Games Won</div>
              </div>
              <div className="text-xl font-bold text-yellow-400 mt-1">
                {stats.wins}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={theme.gameStyles.cards.stat}
            >
              <div className="flex items-center gap-2">
                <Skull className="h-4 w-4 text-red-400" />
                <div className="text-xs text-gray-400">Kills</div>
              </div>
              <div className="text-xl font-bold text-red-400 mt-1">
                {stats.killCount}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={theme.gameStyles.cards.stat}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <div className="text-xs text-gray-400">Nights Survived</div>
              </div>
              <div className="text-xl font-bold text-blue-400 mt-1">
                {stats.survivedNights}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={theme.gameStyles.cards.stat}
            >
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-400" />
                <div className="text-xs text-gray-400">Favorite Role</div>
              </div>
              <div className="text-xl font-bold text-purple-400 mt-1">
                {stats.favoriteRole}
              </div>
            </motion.div>
          </div>

          {/* Games Played */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700"
          >
            <div className="text-sm text-gray-400">Total Games Played</div>
            <div className="text-lg font-bold">{stats.gamesPlayed}</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
