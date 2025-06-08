"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/providers/theme-provider";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Filter,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

interface PublicGamesProps {
  onJoinGame: (gameId: string) => void;
}

// Mock public games data
const mockPublicGames = [
  {
    id: "game_1",
    name: "Night Hunt",
    host: "WolfMaster",
    players: 4,
    maxPlayers: 12,
    status: "waiting",
    createdAt: "5 minutes ago",
  },
  {
    id: "game_2",
    name: "Moonlight Village",
    host: "SeerOfTruth",
    players: 7,
    maxPlayers: 10,
    status: "waiting",
    createdAt: "10 minutes ago",
  },
  {
    id: "game_3",
    name: "Blood Moon Rising",
    host: "AlphaWolf",
    players: 5,
    maxPlayers: 8,
    status: "waiting",
    createdAt: "15 minutes ago",
  },
  {
    id: "game_4",
    name: "Howling Night",
    host: "VillageElder",
    players: 3,
    maxPlayers: 15,
    status: "waiting",
    createdAt: "20 minutes ago",
  },
];

export function PublicGames({ onJoinGame }: PublicGamesProps) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 3;

  // Filter games based on search term
  const filteredGames = mockPublicGames.filter(
    (game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.host.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  return (
    <Card className={theme.gameStyles.cards.profile}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl text-red-400 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Public Games
          </CardTitle>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-700 text-white w-full sm:w-[200px]"
              />
            </div>
            <Button variant="outline" size="icon" className="border-gray-700">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`${theme.typography.textColor.primary}`}>
        <div className="space-y-3">
          <AnimatePresence>
            {currentGames.length > 0 ? (
              currentGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-3">
                        <span className="font-bold">
                          {game.name.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg flex items-center">
                          {game.name}
                          <Badge
                            variant="outline"
                            className="ml-2 bg-blue-900/30 text-blue-300 border-blue-500 text-xs"
                          >
                            Public
                          </Badge>
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                          <div className="flex items-center">
                            <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                            <span>{game.host}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-blue-500" />
                            <span>
                              {game.players}/{game.maxPlayers} players
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-green-500" />
                            <span>{game.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => onJoinGame(game.id)}
                      className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 whitespace-nowrap"
                    >
                      Join Game
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-gray-400"
              >
                <div className="mb-3">No games found matching your search.</div>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {filteredGames.length > gamesPerPage && (
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstGame + 1}-
                {Math.min(indexOfLastGame, filteredGames.length)} of{" "}
                {filteredGames.length} games
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="h-8 w-8 border-gray-700"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-900" />
                </Button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 border-gray-700"
                >
                  <ChevronRight className={`h-4 w-4 text-gray-900`} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
