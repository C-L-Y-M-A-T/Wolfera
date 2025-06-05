"use client"

import { motion } from "framer-motion"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/providers/theme-provider"
import AnimatedText from "@/components/animated-text"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  user: {
    username: string
    avatar: string
    level: number
  }
  notificationCount: number
  onViewProfile: () => void
}

export function DashboardHeader({ user, notificationCount, onViewProfile }: DashboardHeaderProps) {
  const theme = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className={`${theme.gameStyles.cards.profile} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-purple-900/20" />

        <div className="relative p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Game Logo and Title */}
          <div className="flex items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mr-4 shadow-lg shadow-red-900/30"
            >
              <span className="text-2xl font-bold text-white">W</span>
            </motion.div>
            <div>
              <AnimatedText
                text="The Werewolves of Miller's Hollow"
                type="werewolf"
                className="text-xl md:text-2xl font-bold"
                color="text-white"
                size="text-xl md:text-2xl"
                intensity="medium"
              />
              <p className="text-sm text-gray-400">Welcome back, hunter of the night</p>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-300" />
                  {notificationCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                        {notificationCount}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-gray-900 border-gray-700">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                    <p className="font-medium">Friend Request</p>
                    <p className="text-sm text-gray-400">MoonHowler sent you a friend request</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                    <p className="font-medium">Game Invitation</p>
                    <p className="text-sm text-gray-400">VillageProtector invited you to a game</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                    <p className="font-medium">Achievement Unlocked</p>
                    <p className="text-sm text-gray-400">You unlocked "Night Hunter" achievement</p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-center text-sm text-blue-400 cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full border border-gray-700"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border border-gray-900" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-gray-400">Level {user.level}</p>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700">
                <DropdownMenuItem className="cursor-pointer" onClick={onViewProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Animated Border */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}
