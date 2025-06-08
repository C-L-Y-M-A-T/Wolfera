"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "@/providers/theme-provider"
import { useRoleStyles } from "@/hooks/use-role-styles"
import { Moon, Sun, LogOut, Clock } from "lucide-react"
import { GamePhase, Player } from "../game-page"

interface GameHeaderProps {
  gameName: string
  currentPhase: GamePhase
  day: number
  timeRemaining: number
  currentPlayer?: Player
  onLeaveGame: () => void
}

export function GameHeader({
  gameName,
  currentPhase,
  day,
  timeRemaining,
  currentPlayer,
  onLeaveGame,
}: GameHeaderProps) {
  const theme = useTheme()
  const { getRoleIcon, getRoleColorClass } = useRoleStyles()

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case "night":
        return <Moon className="h-4 w-4" />
      case "day":
      case "voting":
        return <Sun className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case "role-reveal":
        return "Role Reveal"
      case "night":
        return "Night Phase"
      case "day":
        return `Day ${day} Discussion`
      case "voting":
        return "Voting Phase"
      case "results":
        return "Results"
      default:
        return "Game Phase"
    }
  }

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "night":
        return "border-blue-400 text-blue-400 bg-blue-950/30"
      case "day":
        return "border-yellow-400 text-yellow-400 bg-yellow-950/30"
      case "voting":
        return "border-red-400 text-red-400 bg-red-950/30"
      case "results":
        return "border-purple-400 text-purple-400 bg-purple-950/30"
      default:
        return "border-slate-400 text-slate-400 bg-slate-950/30"
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeProgress = () => {
    const phaseDurations = {
      "role-reveal": 10,
      night: 60,
      day: 120,
      voting: 30,
      results: 15,
    }
    const totalTime = phaseDurations[currentPhase] || 60
    return ((totalTime - timeRemaining) / totalTime) * 100
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Game Info */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-red-400">{gameName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs ${getPhaseColor()}`}>
                  {getPhaseIcon()}
                  <span className="ml-1">{getPhaseLabel()}</span>
                </Badge>
                {currentPlayer && (
                  <Badge className={`text-xs ${getRoleColorClass(currentPlayer.role)}`}>
                    {getRoleIcon(currentPlayer.role)}
                    <span className="ml-1 capitalize">{currentPlayer.role}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-4">
            <div className="text-center min-w-[120px]">
              <div className="text-2xl font-mono font-bold text-white">{formatTime(timeRemaining)}</div>
              <Progress value={getTimeProgress()} className="w-full h-2 mt-1" />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onLeaveGame}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Leave Game
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
