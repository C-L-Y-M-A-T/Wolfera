"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Crown, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"

interface HostControlsProps {
  canStartGame: boolean
  gameStarting: boolean
  playerCount: number
  minPlayers: number
  allPlayersReady: boolean
  onStartGame: () => void
}

export function HostControls({
  canStartGame,
  gameStarting,
  playerCount,
  minPlayers,
  allPlayersReady,
  onStartGame,
}: HostControlsProps) {
  const theme = useTheme()

  const getStartButtonText = () => {
    if (gameStarting) return "Starting Game..."
    if (playerCount < minPlayers) return `Need ${minPlayers - playerCount} More Players`
    if (!allPlayersReady) return "Waiting for Players to Ready Up"
    return "Start Game"
  }

  const getStatusIcon = () => {
    if (playerCount < minPlayers) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    if (!allPlayersReady) return <Users className="h-4 w-4 text-yellow-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Card className={theme.gameStyles.cards.profile}>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-red-400 flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
            Host Controls
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Game Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">Game Status</span>
              </div>
              <Badge
                variant="outline"
                className={canStartGame ? "border-green-500 text-green-400" : "border-yellow-500 text-yellow-400"}
              >
                {canStartGame ? "Ready to Start" : "Not Ready"}
              </Badge>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Requirements:</div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${playerCount >= minPlayers ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className={playerCount >= minPlayers ? "text-green-400" : "text-red-400"}>
                    Minimum {minPlayers} players ({playerCount}/{minPlayers})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${allPlayersReady ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className={allPlayersReady ? "text-green-400" : "text-yellow-400"}>All players ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <motion.div whileHover={canStartGame ? { scale: 1.02 } : {}} whileTap={canStartGame ? { scale: 0.98 } : {}}>
            <Button
              onClick={onStartGame}
              disabled={!canStartGame || gameStarting}
              className={`w-full h-12 text-lg font-bold ${
                canStartGame
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              } transition-all duration-300`}
            >
              <Play className="h-5 w-5 mr-2" />
              {getStartButtonText()}
            </Button>
          </motion.div>

          {/* Additional Host Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              Kick Player
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              Change Settings
            </Button>
          </div>

          {/* Game Starting Animation */}
          {gameStarting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-2"
              />
              <div className="text-green-400 font-medium">Preparing game...</div>
              <div className="text-xs text-gray-400 mt-1">Assigning roles and setting up the village</div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
