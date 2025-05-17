"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"
import { useState } from "react"
import { AchievementDetailsDialog } from "./achievement-details-dialog"

interface Achievement {
  id: number
  name: string
  description: string
  unlocked: boolean
  date?: string
}

interface AchievementsTabProps {
  achievements: Achievement[]
}

export function AchievementsTab({ achievements }: AchievementsTabProps) {
  const theme = useTheme()
  const [showAchievementDetails, setShowAchievementDetails] = useState<number | null>(null)

  const selectedAchievement = achievements.find((a) => a.id === showAchievementDetails)

  return (
    <>
      <Card className={theme.gameStyles.cards.profile}>
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-400">Achievements</CardTitle>
          <CardDescription>
            You've unlocked {achievements.filter((a) => a.unlocked).length} out of {achievements.length} achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress
              value={(achievements.filter((a) => a.unlocked).length / achievements.length) * 100}
              className="h-2 bg-gray-800"
            />
          </div>

          <motion.div
            variants={theme.variants.container}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2"
          >
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                variants={theme.variants.item}
                whileHover={{ scale: 1.02 }}
                onClick={() => achievement.unlocked && setShowAchievementDetails(achievement.id)}
                className={`relative overflow-hidden rounded-lg border ${
                  achievement.unlocked
                    ? theme.gameStyles.cards.achievement.unlocked
                    : theme.gameStyles.cards.achievement.locked
                } transition-all duration-300`}
              >
                {achievement.unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/20 to-transparent" />
                )}
                <div className="relative p-4 flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-black"
                          : "bg-gray-700"
                      } shadow-lg ${achievement.unlocked ? theme.effects.shadows.yellow.lg : ""}`}
                    >
                      <Trophy className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{achievement.name}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    {achievement.unlocked && achievement.date && (
                      <p className="text-xs text-yellow-400 mt-1">Unlocked: {achievement.date}</p>
                    )}
                  </div>
                  {achievement.unlocked && <ArrowUpRight className="h-4 w-4 text-yellow-400 absolute top-4 right-4" />}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>

      {/* Achievement Details Dialog */}
      {selectedAchievement && (
        <AchievementDetailsDialog
          achievement={selectedAchievement}
          open={!!showAchievementDetails}
          onOpenChange={() => setShowAchievementDetails(null)}
        />
      )}
    </>
  )
}
