"use client"

import type React from "react"

import { createContext, useContext, type ReactNode } from "react"

// Define the game state type
export type Player = {
  id: string
  name: string
  role: string
  isAlive?: boolean
  isRevealed?: boolean
  avatar?: string
  votes?: number
  hasVoted?: boolean
  isProtected?: boolean
  isPoisoned?: boolean
  isInLove?: boolean
}

export type LogEntry = {
  id: string
  message: string
  timestamp: string
  type: "system" | "phase" | "action" | "chat" | "elimination" | "role"
  player?: string
  target?: string
}

export type GamePhase = "setup" | "night" | "day" | "voting" | "results" | "gameOver"

export type GameState = {
  phase: GamePhase
  round: number
  isGameOver: boolean
  winner: "villagers" | "werewolves" | null
  players: Player[]
  currentPlayer: {
    id: string
    name: string
    role: string
  }
  timeRemaining: number
  logs: LogEntry[]
}

export type GameContextType = {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined)

// Create the provider component
export function GameProvider({
  children,
  value,
}: {
  children: ReactNode
  value: GameContextType
}) {
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

// Create a hook to use the game context
export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
