"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Eye, Skull, Users, Shield, FlaskRound, Axe, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"
import { useState } from "react"

interface GameSettingsProps {
  settings: {
    roles: {
      werewolves: number
      villagers: number
      seer: number
      doctor: number
      hunter: number
      witch: number
    }
    nightDuration: number
    dayDuration: number
    discussionTime: number
    votingTime: number
  }
  onSettingsChange: (settings: any) => void
}

const roleIcons = {
  werewolves: <Skull className="h-4 w-4" />,
  villagers: <Users className="h-4 w-4" />,
  seer: <Eye className="h-4 w-4" />,
  doctor: <Shield className="h-4 w-4" />,
  hunter: <Axe className="h-4 w-4" />,
  witch: <FlaskRound className="h-4 w-4" />,
}

const roleColors = {
  werewolves: "text-red-400 bg-red-950/50 border-red-500/30",
  villagers: "text-blue-400 bg-blue-950/50 border-blue-500/30",
  seer: "text-purple-400 bg-purple-950/50 border-purple-500/30",
  doctor: "text-green-400 bg-green-950/50 border-green-500/30",
  hunter: "text-yellow-400 bg-yellow-950/50 border-yellow-500/30",
  witch: "text-indigo-400 bg-indigo-950/50 border-indigo-500/30",
}

export function GameSettings({ settings, onSettingsChange }: GameSettingsProps) {
  const theme = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  const totalPlayers = Object.values(settings.roles).reduce((sum, count) => sum + count, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className={theme.gameStyles.cards.profile}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-red-400 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-500" />
              Game Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Role Distribution */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Role Distribution</h3>
                <Badge variant="outline" className={theme.gameStyles.badges.default}>
                  {totalPlayers} Total
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(settings.roles).map(([role, count], index) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${roleColors[role as keyof typeof roleColors]} backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {roleIcons[role as keyof typeof roleIcons]}
                        <span className="text-sm font-medium capitalize">
                          {role === "werewolves" ? "Werewolves" : role}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-gray-800/50 text-white">
                        {count}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Time Settings */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-medium text-gray-300">Time Settings</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                      <div className="text-xs text-gray-400 mb-1">Night Phase</div>
                      <div className="text-lg font-bold text-blue-400">{settings.nightDuration}s</div>
                    </div>

                    <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                      <div className="text-xs text-gray-400 mb-1">Day Phase</div>
                      <div className="text-lg font-bold text-yellow-400">{settings.dayDuration}s</div>
                    </div>

                    <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                      <div className="text-xs text-gray-400 mb-1">Discussion</div>
                      <div className="text-lg font-bold text-green-400">{settings.discussionTime}s</div>
                    </div>

                    <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                      <div className="text-xs text-gray-400 mb-1">Voting</div>
                      <div className="text-lg font-bold text-red-400">{settings.votingTime}s</div>
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                    >
                      Modify Settings
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
