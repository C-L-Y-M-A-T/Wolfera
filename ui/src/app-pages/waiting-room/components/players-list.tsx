"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Crown, Check, Clock, UserPlus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"

interface Player {
  id: string
  username: string
  avatar: string
  isHost: boolean
  isReady: boolean
  status: "online" | "offline" | "in-game"
  joinedAt: Date
}

interface PlayersListProps {
  players: Player[]
  maxPlayers: number
  currentPlayer: string
  onPlayerReady: (playerId: string) => void
}

export function PlayersList({ players, maxPlayers, currentPlayer, onPlayerReady }: PlayersListProps) {
  const theme = useTheme()
  const emptySlots = maxPlayers - players.length

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-full"
    >
      <Card className={`${theme.gameStyles.cards.profile} h-full flex flex-col`}>
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-red-400 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Players ({players.length}/{maxPlayers})
            </CardTitle>
            <Badge variant="outline" className={theme.gameStyles.badges.default}>
              {players.filter((p) => p.isReady).length} Ready
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {/* Current Players */}
            <AnimatePresence mode="popLayout">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-red-500/30 transition-all duration-300"
                >
                  {/* Player Ready Glow */}
                  {player.isReady && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  <div className="relative p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="relative">
                        <motion.img
                          src={player.avatar}
                          alt={player.username}
                          className="w-12 h-12 rounded-full border-2 border-gray-600"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />

                        {/* Status Indicator */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                            player.status === "online" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />

                        {/* Host Crown */}
                        {player.isHost && (
                          <motion.div
                            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                          >
                            <Crown className="h-3 w-3 text-black" />
                          </motion.div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white truncate">{player.username}</span>
                          {player.username === currentPlayer && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-900/50 text-blue-300 border-blue-500 flex-shrink-0"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">Joined {player.joinedAt.toLocaleTimeString()}</div>
                      </div>
                    </div>

                    {/* Ready Status & Button */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {player.isReady ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-green-400"
                        >
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium hidden sm:inline">Ready</span>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm hidden sm:inline">Waiting</span>
                        </div>
                      )}

                      {/* Ready Button (only for current player) */}
                      {player.username === currentPlayer && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            variant={player.isReady ? "outline" : "default"}
                            onClick={() => onPlayerReady(player.id)}
                            className={
                              player.isReady
                                ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                            }
                          >
                            {player.isReady ? "Not Ready" : "Ready Up"}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty Slots */}
            {emptySlots > 0 && (
              <div className="space-y-2">
                {Array.from({ length: Math.min(emptySlots, 4) }).map((_, index) => (
                  <motion.div
                    key={`empty-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (players.length + index) * 0.1 }}
                    className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/20 backdrop-blur-sm"
                  >
                    <div className="p-4 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-gray-500">
                        <UserPlus className="h-5 w-5" />
                        <span className="text-sm">Waiting for player...</span>
                      </div>
                    </div>

                    {/* Animated dots */}
                    <motion.div
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {[0, 1, 2].map((dotIndex) => (
                        <motion.div
                          key={dotIndex}
                          className="w-1 h-1 bg-gray-500 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: dotIndex * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                ))}

                {emptySlots > 4 && (
                  <div className="text-center text-gray-500 text-sm py-2">+{emptySlots - 4} more slots available</div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
