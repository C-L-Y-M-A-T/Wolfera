"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Trophy, User, Users, MessageSquare } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"

interface ActivityItem {
  id: string
  type: "game" | "achievement" | "friend" | "message"
  description: string
  timestamp: string
  result?: "Win" | "Loss"
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const theme = useTheme()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "game":
        return <Users className="h-4 w-4 text-blue-400" />
      case "achievement":
        return <Trophy className="h-4 w-4 text-yellow-400" />
      case "friend":
        return <User className="h-4 w-4 text-green-400" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Card className={theme.gameStyles.cards.profile}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-red-400 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-green-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300"
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
                {activity.result && (
                  <Badge
                    variant={activity.result === "Win" ? "default" : "outline"}
                    className={activity.result === "Win" ? theme.gameStyles.badges.win : theme.gameStyles.badges.loss}
                  >
                    {activity.result}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
