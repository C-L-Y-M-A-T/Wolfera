"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { useTheme } from "@/providers/theme-provider";
import { motion } from "framer-motion";
import { ChevronRight, User } from "lucide-react";
import React from "react";

interface Game {
  id: string;
  date: string;
  result: string;
  role: string;
  players: number;
}

interface GameHistoryTabProps {
  games: Game[];
}

export function GameHistoryTab({ games }: GameHistoryTabProps) {
  const theme = useTheme();
  const { getRoleIcon } = useRoleStyles();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLoadMoreGames = async () => {
    setIsLoading(true);
    try {
      // Fetch more games
      // Update games state
    } catch (error) {
      console.error("Failed to load more games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={theme.gameStyles.cards.profile}>
      <CardHeader>
        <CardTitle className="text-2xl text-blue-400">Game History</CardTitle>
        <CardDescription>Your journey through Miller's Hollow</CardDescription>
      </CardHeader>
      <CardContent className={`${theme.typography.textColor.primary}`}>
        <div className="relative">
          {/* Timeline line */}
          <div className={theme.gameStyles.timeline.line} />

          <motion.div
            variants={theme.variants.container}
            initial="hidden"
            animate="visible"
            className="space-y-6 relative"
          >
            {games.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No games played yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    /* Navigate to game finder */
                  }}
                >
                  Find a Game
                </Button>
              </div>
            ) : (
              <>
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    variants={theme.variants.item}
                    className={theme.gameStyles.timeline.item}
                  >
                    {/* Timeline dot */}
                    <div
                      className={
                        game.result === "Win"
                          ? theme.gameStyles.timeline.dot.win
                          : theme.gameStyles.timeline.dot.loss
                      }
                    >
                      {getRoleIcon(game.role) || <User className="h-4 w-4" />}
                    </div>

                    <div className={theme.gameStyles.timeline.content}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">
                            {game.role} - {game.result}
                          </h3>
                          <p className="text-sm text-gray-400">{game.date}</p>
                        </div>
                        <Badge
                          variant={
                            game.result === "Win" ? "default" : "outline"
                          }
                          className={
                            game.result === "Win"
                              ? theme.gameStyles.badges.win
                              : theme.gameStyles.badges.loss
                          }
                        >
                          {game.result}
                        </Badge>
                      </div>

                      <div className="text-sm">
                        <div className="flex justify-between py-1 border-b border-gray-700">
                          <span className="text-gray-400">Players</span>
                          <span>{game.players}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-700">
                          <span className="text-gray-400">Game Duration</span>
                          <span>
                            {/* Use actual game duration from API */}20 minutes
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">Survived</span>
                          <span>{game.result === "Win" ? "Yes" : "No"}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-4 text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        View Game Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            <div className="relative pl-10">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700">
                <ChevronRight className="h-4 w-4" />
              </div>
              <Button
                variant="link"
                className="w-full text-gray-400 hover:text-white hover:bg-gray-800 border-dashed"
                disabled={isLoading}
                onClick={handleLoadMoreGames}
              >
                {isLoading ? "Loading..." : "Load More Games"}
              </Button>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
