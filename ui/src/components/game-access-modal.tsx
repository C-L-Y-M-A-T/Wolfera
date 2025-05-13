"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateGameModal } from "@/components/create-game-modal"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Unlock } from "lucide-react"

// Mock data for public games
const publicGames = [
  { id: "game1", name: "Village Mayhem", players: 5, maxPlayers: 12, status: "waiting" },
  { id: "game2", name: "Moonlit Hunt", players: 8, maxPlayers: 10, status: "waiting" },
  { id: "game3", name: "Howling Night", players: 3, maxPlayers: 8, status: "waiting" },
]

export function GameAccessModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [gameCode, setGameCode] = useState("")
  const [createGameOpen, setCreateGameOpen] = useState(false)
  const router = useRouter()

  const handleJoinGame = (gameId: string) => {
    // In a real app, this would validate the game code and redirect to the game
    console.log(`Joining game: ${gameId}`)
    setOpen(false)
    router.push(`/game/${gameId}`)
  }

  const handleJoinByCode = () => {
    if (gameCode.trim()) {
      handleJoinGame(gameCode)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Join a Game</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="join" className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="join">Join Game</TabsTrigger>
              <TabsTrigger value="public">Public Games</TabsTrigger>
            </TabsList>

            <TabsContent value="join" className="space-y-4 mt-4">
              <div className="flex space-x-2">
                <Input placeholder="Enter game code" value={gameCode} onChange={(e) => setGameCode(e.target.value)} />
                <Button onClick={handleJoinByCode}>Join</Button>
              </div>

              <div className="text-center mt-6">
                <p className="mb-4">Or create your own game</p>
                <Button
                  onClick={() => {
                    setOpen(false)
                    setCreateGameOpen(true)
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Create Game
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="public" className="mt-4">
              <div className="space-y-4">
                {publicGames.map((game) => (
                  <Card key={game.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{game.name}</CardTitle>
                        <Unlock className="h-4 w-4 text-gray-400" />
                      </div>
                      <CardDescription>
                        Players: {game.players}/{game.maxPlayers}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button onClick={() => handleJoinGame(game.id)} className="w-full">
                        Join Game
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <CreateGameModal open={createGameOpen} onOpenChange={setCreateGameOpen} />
    </>
  )
}
