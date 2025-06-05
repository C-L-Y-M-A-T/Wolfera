"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ChevronRight } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"

interface Achievement {
  id: number
  name: string
  description: string
  unlocked: boolean
  date?: string
}

interface AchievementShowcaseProps {
  achievements: Achievement[]
  onViewAllAchievements: () => void
}

export function AchievementShowcase({ achievements, onViewAllAchievements }: AchievementShowcaseProps) {
  const theme = useTheme()

  return (
    <Card className={theme.gameStyles.cards.profile}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-red-400 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-2 shadow-lg shadow-yellow-500/20">
                <Trophy className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-sm font-medium text-yellow-400">{achievement.name}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={onViewAllAchievements}
          className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
        >
          View All Achievements
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
