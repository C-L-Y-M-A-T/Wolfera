"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Player } from "@/providers/game-provider"
import { useTheme } from "@/providers/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sun, Send } from "lucide-react"

type DayPhaseProps = {
  currentPlayer: {
    id: string
    name: string
    role: string
  }
  players: Player[]
  round: number
}

type ChatMessage = {
  id: string
  playerId: string
  playerName: string
  message: string
  timestamp: Date
}

export default function DayPhase({ currentPlayer, players, round }: DayPhaseProps) {
  const theme = useTheme()
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      playerId: "system",
      playerName: "Game",
      message: "Day phase has begun. Discuss who might be a werewolf!",
      timestamp: new Date(),
    },
    {
      id: "2",
      playerId: "2",
      playerName: "Player 2",
      message: "Did anyone get any information last night?",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "3",
      playerId: "3",
      playerName: "Player 3",
      message: "I'm the Seer, and I checked Player 5 last night. They're a Werewolf!",
      timestamp: new Date(Date.now() - 45000),
    },
    {
      id: "4",
      playerId: "5",
      playerName: "Player 5",
      message: "That's a lie! I'm a Villager. Player 3 must be the Werewolf trying to frame me.",
      timestamp: new Date(Date.now() - 30000),
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: ChatMessage = {
      id: String(chatMessages.length + 1),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message: message.trim(),
      timestamp: new Date(),
    }

    setChatMessages([...chatMessages, newMessage])
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Sun className="mx-auto h-12 w-12 text-amber-400" />
          <h2 className="mt-2 text-2xl font-bold text-white">Day {round}</h2>
          <p className="mt-1 text-gray-300">Discuss with the village and identify the werewolves</p>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col rounded-lg bg-black/30 backdrop-blur-sm">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {chatMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-3 ${msg.playerId === currentPlayer.id ? "flex-row-reverse" : ""}`}
              >
                {msg.playerId !== "system" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={players.find((p) => p.id === msg.playerId)?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{msg.playerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    msg.playerId === "system"
                      ? "bg-indigo-900/50 text-indigo-100"
                      : msg.playerId === currentPlayer.id
                        ? "bg-purple-700/70 text-white"
                        : "bg-gray-800/70 text-white"
                  }`}
                >
                  {msg.playerId !== "system" && (
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium">{msg.playerName}</span>
                      <span className="text-xs text-gray-400">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="border-white/20 bg-black/30 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
            />
            <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
