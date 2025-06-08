"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Eye,
  Skull,
  Users,
  Shield,
  FlaskRound,
  Axe,
  Info,
  ChevronRight,
  Moon,
  Sun,
  Vote,
  Clock,
} from "lucide-react"
import { useTheme } from "@/providers/theme-provider"
import { RoleDetailModal } from "./role-detail-modal"
import { GameRulesModal } from "./game-rules-modal"

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

const roles: Role[] = [
  {
    id: "villager",
    name: "Villager",
    team: "Good",
    icon: <Users className="h-5 w-5" />,
    color: "text-blue-400 bg-blue-950/50 border-blue-500/30",
    shortDescription: "Innocent townspeople trying to survive",
    detailedDescription:
      "Villagers are the backbone of the town. They have no special abilities but must use their wit, observation skills, and voting power to identify and eliminate the werewolves threatening their community.",
    abilities: ["Vote during the day phase", "Participate in discussions", "No special night actions"],
    tips: [
      "Pay attention to voting patterns and behavior",
      "Form alliances with trusted players",
      "Share information but be careful who you trust",
      "Look for inconsistencies in stories",
    ],
    winCondition: "Eliminate all werewolves",
  },
  {
    id: "werewolf",
    name: "Werewolf",
    team: "Evil",
    icon: <Skull className="h-5 w-5" />,
    color: "text-red-400 bg-red-950/50 border-red-500/30",
    shortDescription: "Creatures of the night hunting villagers",
    detailedDescription:
      "Werewolves are the primary antagonists who hunt during the night. They must eliminate villagers while blending in during the day, using deception and misdirection to avoid detection.",
    abilities: [
      "Kill one player each night (team decision)",
      "Communicate with other werewolves at night",
      "Vote and discuss during the day like everyone else",
    ],
    tips: [
      "Coordinate with your pack during night phases",
      "Act like a concerned villager during the day",
      "Don't be too aggressive in accusations",
      "Create confusion and misdirect suspicion",
    ],
    winCondition: "Equal or outnumber the villagers",
  },
  {
    id: "seer",
    name: "Seer",
    team: "Good",
    icon: <Eye className="h-5 w-5" />,
    color: "text-purple-400 bg-purple-950/50 border-purple-500/30",
    shortDescription: "Can see the true nature of players",
    detailedDescription:
      "The Seer has the mystical ability to peer into the souls of other players, learning their true allegiance. This powerful role must use their knowledge wisely while staying hidden from the werewolves.",
    abilities: [
      "Investigate one player each night",
      "Learn if the target is a werewolf or not",
      "Vote and discuss during the day",
    ],
    tips: [
      "Don't reveal yourself too early",
      "Build a network of trusted allies",
      "Use your information strategically",
      "Be prepared to prove your role if necessary",
    ],
    winCondition: "Help eliminate all werewolves",
  },
  {
    id: "doctor",
    name: "Doctor",
    team: "Good",
    icon: <Shield className="h-5 w-5" />,
    color: "text-green-400 bg-green-950/50 border-green-500/30",
    shortDescription: "Protects players from werewolf attacks",
    detailedDescription:
      "The Doctor is the town's guardian, capable of protecting one person each night from werewolf attacks. Their healing powers are crucial for keeping key players alive.",
    abilities: [
      "Protect one player each night from elimination",
      "Cannot protect the same player twice in a row",
      "Cannot protect themselves",
    ],
    tips: [
      "Protect players you suspect are important roles",
      "Vary your protection patterns",
      "Pay attention to who might be targeted",
      "Stay hidden to avoid being eliminated",
    ],
    winCondition: "Help eliminate all werewolves",
  },
  {
    id: "hunter",
    name: "Hunter",
    team: "Good",
    icon: <Axe className="h-5 w-5" />,
    color: "text-yellow-400 bg-yellow-950/50 border-yellow-500/30",
    shortDescription: "Takes revenge when eliminated",
    detailedDescription:
      "The Hunter is a skilled marksman who, even in death, can take one final shot. When eliminated, they can choose to eliminate another player, making them a dangerous target for werewolves.",
    abilities: [
      "When eliminated, can immediately eliminate another player",
      "This ability works regardless of how they die",
      "Vote and discuss during the day",
    ],
    tips: [
      "Don't reveal your role unless necessary",
      "Save your shot for confirmed werewolves",
      "Be observant to make the best final choice",
      "Consider the game state when using your ability",
    ],
    winCondition: "Help eliminate all werewolves",
  },
  {
    id: "witch",
    name: "Witch",
    team: "Good",
    icon: <FlaskRound className="h-5 w-5" />,
    color: "text-indigo-400 bg-indigo-950/50 border-indigo-500/30",
    shortDescription: "Has healing and poison potions",
    detailedDescription:
      "The Witch possesses two powerful potions: one that can save a life and another that can take one. These single-use abilities make the Witch a versatile but vulnerable role.",
    abilities: [
      "Healing potion: Save the werewolf victim (once per game)",
      "Poison potion: Eliminate any player (once per game)",
      "Can use both potions in the same night",
    ],
    tips: [
      "Save your healing potion for crucial moments",
      "Use poison on confirmed werewolves",
      "Don't waste potions early in the game",
      "Coordinate with other roles if possible",
    ],
    winCondition: "Help eliminate all werewolves",
  },
]

export function GameGuide() {
  const theme = useTheme()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showGameRules, setShowGameRules] = useState(false)

  return (
    <>
      <Card className={theme.gameStyles.cards.profile}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-red-400 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
              Game Guide
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGameRules(true)}
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              <Info className="h-4 w-4 mr-2" />
              Game Rules
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Game Overview */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-gray-300 mb-2">How to Play</h3>
              <p className="text-sm text-gray-400 mb-3">
                A social deduction game where villagers must find and eliminate werewolves before they're all
                eliminated.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">Night: Special roles act</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-300">Day: Discussion & voting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Vote className="h-4 w-4 text-red-400" />
                  <span className="text-gray-300">Eliminate suspected werewolves</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Survive until victory</span>
                </div>
              </div>
            </div>

            {/* Roles Grid */}
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-3">Character Roles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-lg border ${role.color} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {role.icon}
                        <span className="font-medium">{role.name}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          role.team === "Evil" ? "bg-red-900/50 text-red-300" : "bg-blue-900/50 text-blue-300"
                        }`}
                      >
                        {role.team}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{role.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Click for details</span>
                      <ChevronRight className="h-3 w-3 text-gray-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Team Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="font-medium text-blue-400">Good Team</span>
                </div>
                <p className="text-xs text-gray-400">Villagers, Seer, Doctor, Hunter, Witch</p>
                <p className="text-xs text-blue-300 mt-1">Win by eliminating all werewolves</p>
              </div>
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Skull className="h-4 w-4 text-red-400" />
                  <span className="font-medium text-red-400">Evil Team</span>
                </div>
                <p className="text-xs text-gray-400">Werewolves</p>
                <p className="text-xs text-red-300 mt-1">Win by equaling villager numbers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Detail Modal */}
      <RoleDetailModal role={selectedRole} open={!!selectedRole} onOpenChange={() => setSelectedRole(null)} />

      {/* Game Rules Modal */}
      <GameRulesModal open={showGameRules} onOpenChange={setShowGameRules} />
    </>
  )
}
