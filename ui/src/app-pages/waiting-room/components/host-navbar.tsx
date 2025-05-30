"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Crown, Users, AlertTriangle, CheckCircle, Settings, UserMinus, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"
import { useState } from "react"
import { GameSettingsModal } from "./game-settings-modal"

interface HostNavbarProps {
  canStartGame: boolean
  gameStarting: boolean
  playerCount: number
  minPlayers: number
  allPlayersReady: boolean
  onStartGame: () => void
  settings: any
  onSettingsChange: (settings: any) => void
}

export function HostNavbar({
  canStartGame,
  gameStarting,
  playerCount,
  minPlayers,
  allPlayersReady,
  onStartGame,
  settings,
  onSettingsChange,
}: HostNavbarProps) {
  const theme = useTheme()
  const [showSettings, setShowSettings] = useState(false)

  const getStartButtonText = () => {
    if (gameStarting) return "Starting Game..."
    if (playerCount < minPlayers) return `Need ${minPlayers - playerCount} More`
    if (!allPlayersReady) return "Waiting for Players"
    return "Start Game"
  }

  const getStatusIcon = () => {
    if (playerCount < minPlayers) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    if (!allPlayersReady) return <Users className="h-4 w-4 text-yellow-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-700"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Host Badge */}
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold px-3 py-1">
                <Crown className="h-4 w-4 mr-2" />
                Host Controls
              </Badge>

              {/* Game Status */}
              <div className="flex items-center gap-2 text-sm">
                {getStatusIcon()}
                <span className={canStartGame ? "text-green-400" : "text-yellow-400"}>
                  {canStartGame ? "Ready to Start" : "Not Ready"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Settings Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </motion.div>

              {/* Kick Player Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Kick
                </Button>
              </motion.div>

              {/* Reset Game Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </motion.div>

              {/* Start Game Button */}
              <motion.div
                whileHover={canStartGame ? { scale: 1.05 } : {}}
                whileTap={canStartGame ? { scale: 0.95 } : {}}
              >
                <Button
                  onClick={onStartGame}
                  disabled={!canStartGame || gameStarting}
                  size="sm"
                  className={`px-6 font-bold ${
                    canStartGame
                      ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  } transition-all duration-300`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {getStartButtonText()}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Game Starting Progress */}
          {gameStarting && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pb-4">
              <div className="flex items-center justify-center gap-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"
                />
                <div className="text-green-400 font-medium">Preparing game...</div>
                <div className="text-xs text-gray-400">Assigning roles and setting up the village</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Game Settings Modal */}
      <GameSettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </>
  )
}
