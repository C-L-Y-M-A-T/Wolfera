"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Target, Lightbulb, Trophy } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"

interface Role {
  id: string
  name: string
  team: "Good" | "Evil"
  icon: React.ReactNode
  color: string
  shortDescription: string
  detailedDescription: string
  abilities: string[]
  tips: string[]
  winCondition: string
}

interface RoleDetailModalProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleDetailModal({ role, open, onOpenChange }: RoleDetailModalProps) {
  const theme = useTheme()

  if (!role) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${role.color}`}>{role.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{role.name}</span>
                <Badge
                  variant="secondary"
                  className={`${role.team === "Evil" ? "bg-red-900/50 text-red-300" : "bg-blue-900/50 text-blue-300"}`}
                >
                  {role.team} Team
                </Badge>
              </div>
              <p className="text-sm text-gray-400 font-normal">{role.shortDescription}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Description</h3>
            <p className="text-gray-400 leading-relaxed">{role.detailedDescription}</p>
          </div>

          {/* Abilities */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Abilities
            </h3>
            <div className="space-y-2">
              {role.abilities.map((ability, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{ability}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy Tips */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Strategy Tips
            </h3>
            <div className="space-y-2">
              {role.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-yellow-900/10 border border-yellow-500/20 rounded-lg"
                >
                  <Lightbulb className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Win Condition */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Win Condition
            </h3>
            <div className="p-4 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 font-medium">{role.winCondition}</p>
            </div>
          </div>

          {/* Team Information */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="font-medium mb-2">Team Dynamics</h4>
            {role.team === "Good" ? (
              <p className="text-sm text-gray-400">
                As a member of the Good team, you must work together with other villagers to identify and eliminate the
                werewolves. Communication and trust are key, but be careful who you reveal your role to.
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                As a member of the Evil team, you must eliminate villagers while maintaining your cover during the day.
                Coordinate with your fellow werewolves and sow confusion among the villagers.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
