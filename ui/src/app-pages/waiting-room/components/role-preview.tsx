"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Skull, Users, Shield, FlaskRound, Axe, Info } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"

interface RolePreviewProps {
  settings: {
    roles: {
      werewolves: number
      villagers: number
      seer: number
      doctor: number
      hunter: number
      witch: number
    }
  }
  playerCount: number
  isExpanded: boolean
  onTogglePreview: () => void
}

const roleData = {
  werewolves: {
    icon: <Skull className="h-5 w-5" />,
    color: "text-red-400 bg-red-950/50 border-red-500/30",
    description: "Eliminate villagers during the night phase",
    team: "Evil",
  },
  villagers: {
    icon: <Users className="h-5 w-5" />,
    color: "text-blue-400 bg-blue-950/50 border-blue-500/30",
    description: "Find and eliminate all werewolves",
    team: "Good",
  },
  seer: {
    icon: <Eye className="h-5 w-5" />,
    color: "text-purple-400 bg-purple-950/50 border-purple-500/30",
    description: "Can investigate one player each night",
    team: "Good",
  },
  doctor: {
    icon: <Shield className="h-5 w-5" />,
    color: "text-green-400 bg-green-950/50 border-green-500/30",
    description: "Can protect one player from elimination each night",
    team: "Good",
  },
  hunter: {
    icon: <Axe className="h-5 w-5" />,
    color: "text-yellow-400 bg-yellow-950/50 border-yellow-500/30",
    description: "Can eliminate another player when eliminated",
    team: "Good",
  },
  witch: {
    icon: <FlaskRound className="h-5 w-5" />,
    color: "text-indigo-400 bg-indigo-950/50 border-indigo-500/30",
    description: "Has a healing potion and a poison potion",
    team: "Good",
  },
}

export function RolePreview({ settings, playerCount }: RolePreviewProps) {
  const theme = useTheme()

  const activeRoles = Object.entries(settings.roles).filter(([_, count]) => count > 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="h-full"
    >
      <Card className={`${theme.gameStyles.cards.profile} h-full flex flex-col`}>
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="text-xl text-red-400 flex items-center">
            <Info className="w-5 h-5 mr-2 text-yellow-500" />
            Role Preview
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {/* Quick Summary */}
          <div className="flex flex-wrap gap-2 mb-6">
            {activeRoles.map(([role, count]) => (
              <motion.div
                key={role}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Badge variant="outline" className={`${roleData[role as keyof typeof roleData].color} border`}>
                  {roleData[role as keyof typeof roleData].icon}
                  <span className="ml-1 capitalize">
                    {role === "werewolves" ? "Werewolves" : role} ({count})
                  </span>
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* Detailed Role Information */}
          <div className="space-y-4">
            <div className="text-sm text-gray-400 mb-4">Roles will be randomly assigned when the game starts</div>

            {activeRoles.map(([role, count], index) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${roleData[role as keyof typeof roleData].color} backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {roleData[role as keyof typeof roleData].icon}
                    <span className="font-medium capitalize">{role === "werewolves" ? "Werewolves" : role}</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        roleData[role as keyof typeof roleData].team === "Evil"
                          ? "bg-red-900/50 text-red-300"
                          : "bg-blue-900/50 text-blue-300"
                      }`}
                    >
                      {roleData[role as keyof typeof roleData].team}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="bg-gray-800/50 text-white">
                    {count} {count === 1 ? "player" : "players"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">{roleData[role as keyof typeof roleData].description}</p>
              </motion.div>
            ))}

            {/* Game Balance Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mt-6"
            >
              <div className="text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Game Balance:</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-blue-300 border-blue-500">
                      Good:{" "}
                      {Object.entries(settings.roles).reduce(
                        (sum, [role, count]) =>
                          roleData[role as keyof typeof roleData].team === "Good" ? sum + count : sum,
                        0,
                      )}
                    </Badge>
                    <Badge variant="outline" className="text-red-300 border-red-500">
                      Evil: {settings.roles.werewolves}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Recommended for {playerCount} players</div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
