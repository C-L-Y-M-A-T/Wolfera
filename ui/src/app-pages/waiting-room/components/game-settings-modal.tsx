"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Eye, Skull, Users, Shield, FlaskRound, Axe, Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"
import { useState } from "react"

interface GameSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function GameSettingsModal({ open, onOpenChange, settings, onSettingsChange }: GameSettingsModalProps) {
  const theme = useTheme()
  const [localSettings, setLocalSettings] = useState(settings)

  const updateRoleCount = (role: string, change: number) => {
    const newCount = Math.max(0, localSettings.roles[role as keyof typeof localSettings.roles] + change)
    setLocalSettings((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: newCount,
      },
    }))
  }

  const updateTimeSettings = (setting: string, value: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
    onOpenChange(false)
  }

  const totalPlayers = Object.values(localSettings.roles).reduce((sum, count) => sum + count, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-400 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Game Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Role Distribution */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-300">Role Distribution</h3>
              <Badge variant="outline" className={theme.gameStyles.badges.default}>
                {totalPlayers} Total Players
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(localSettings.roles).map(([role, count]) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${roleColors[role as keyof typeof roleColors]} backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {roleIcons[role as keyof typeof roleIcons]}
                      <span className="font-medium capitalize">{role === "werewolves" ? "Werewolves" : role}</span>
                    </div>
                    <Badge variant="secondary" className="bg-gray-800/50 text-white">
                      {count}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateRoleCount(role, -1)}
                      disabled={count === 0}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-lg font-bold w-8 text-center">{count}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateRoleCount(role, 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Time Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-4">Time Settings (seconds)</h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "nightDuration", label: "Night Phase", color: "text-blue-400" },
                { key: "dayDuration", label: "Day Phase", color: "text-yellow-400" },
                { key: "discussionTime", label: "Discussion", color: "text-green-400" },
                { key: "votingTime", label: "Voting", color: "text-red-400" },
              ].map(({ key, label, color }) => (
                <div key={key} className="p-3 rounded-lg border border-gray-700 bg-gray-800/50">
                  <div className="text-xs text-gray-400 mb-2">{label}</div>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateTimeSettings(key, Math.max(30, localSettings[key as keyof typeof localSettings] - 30))
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className={`text-lg font-bold w-12 text-center ${color}`}>
                      {localSettings[key as keyof typeof localSettings]}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTimeSettings(key, localSettings[key as keyof typeof localSettings] + 30)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preset Configurations */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-4">Quick Presets</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Balanced", players: 8 },
                { name: "Large Game", players: 12 },
                { name: "Quick Game", players: 6 },
              ].map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {preset.name}
                  <br />
                  <span className="text-xs">{preset.players} players</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
