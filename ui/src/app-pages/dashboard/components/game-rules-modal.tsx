"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Vote, Users, Skull, Clock, Target, AlertTriangle } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"

interface GameRulesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GameRulesModal({ open, onOpenChange }: GameRulesModalProps) {
  const theme = useTheme()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-gray-900 border-gray-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-400">Game Rules & How to Play</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Game Overview */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3">Game Overview</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              The Werewolves of Miller's Hollow is a social deduction game where players are secretly assigned roles as
              either villagers or werewolves. The villagers must identify and eliminate all werewolves before they are
              eliminated themselves.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="font-medium text-blue-400">Villagers</span>
                </div>
                <p className="text-xs text-gray-400">Find and eliminate all werewolves</p>
              </div>
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Skull className="h-4 w-4 text-red-400" />
                  <span className="font-medium text-red-400">Werewolves</span>
                </div>
                <p className="text-xs text-gray-400">Equal or outnumber the villagers</p>
              </div>
            </div>
          </div>

          {/* Game Phases */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3">Game Phases</h3>
            <div className="space-y-4">
              {/* Night Phase */}
              <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="h-5 w-5 text-blue-400" />
                  <h4 className="font-medium text-blue-400">Night Phase</h4>
                  <Badge variant="outline" className="text-xs bg-blue-900/30 text-blue-300 border-blue-500">
                    Eyes Closed
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>• All players close their eyes (or screens go dark)</p>
                  <p>• Werewolves wake up and choose a victim to eliminate</p>
                  <p>• Special roles (Seer, Doctor, Witch) perform their actions</p>
                  <p>• All actions are performed secretly</p>
                </div>
              </div>

              {/* Day Phase */}
              <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="h-5 w-5 text-yellow-400" />
                  <h4 className="font-medium text-yellow-400">Day Phase</h4>
                  <Badge variant="outline" className="text-xs bg-yellow-900/30 text-yellow-300 border-yellow-500">
                    Discussion
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>• Night results are revealed (who was eliminated)</p>
                  <p>• All surviving players discuss and share information</p>
                  <p>• Players vote to eliminate someone they suspect is a werewolf</p>
                  <p>• The player with the most votes is eliminated</p>
                </div>
              </div>

              {/* Voting Phase */}
              <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Vote className="h-5 w-5 text-red-400" />
                  <h4 className="font-medium text-red-400">Voting Phase</h4>
                  <Badge variant="outline" className="text-xs bg-red-900/30 text-red-300 border-red-500">
                    Elimination
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>• Each player votes for who they want to eliminate</p>
                  <p>• Votes are revealed simultaneously</p>
                  <p>• Player with most votes is eliminated from the game</p>
                  <p>• In case of a tie, there may be a revote or no elimination</p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Flow */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              Game Flow
            </h3>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span>Night Phase</span>
                </div>
                <span className="text-gray-500">→</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span>Day Discussion</span>
                </div>
                <span className="text-gray-500">→</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span>Voting</span>
                </div>
                <span className="text-gray-500">→</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <span>Repeat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Win Conditions */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-yellow-400" />
              Win Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Villagers Win When:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• All werewolves are eliminated</li>
                  <li>• Through voting during day phases</li>
                  <li>• Or special role abilities</li>
                </ul>
              </div>
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h4 className="font-medium text-red-400 mb-2">Werewolves Win When:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• They equal or outnumber villagers</li>
                  <li>• Through night eliminations</li>
                  <li>• And day phase manipulations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Rules */}
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Important Rules
            </h3>
            <div className="space-y-2">
              {[
                "Dead players cannot communicate with living players",
                "Players cannot show their role cards to others",
                "No private communication during the game (unless specified by role)",
                "The moderator's decisions are final",
                "Players must follow the honor system for night actions",
                "Eliminated players should not influence the game",
              ].map((rule, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-orange-900/10 border border-orange-500/20 rounded"
                >
                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips for New Players */}
          <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-lg">
            <h4 className="font-medium text-green-400 mb-2">Tips for New Players</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Pay attention to voting patterns and behavior changes</li>
              <li>• Don't reveal your role unless absolutely necessary</li>
              <li>• Form alliances but be careful who you trust</li>
              <li>• Use logic and deduction, not just gut feelings</li>
              <li>• Remember that werewolves will try to act like villagers</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
