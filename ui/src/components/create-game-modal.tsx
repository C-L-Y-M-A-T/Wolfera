"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Available roles in the game
const availableRoles = [
  { id: "villager", name: "Villager", description: "A regular villager trying to find the werewolves" },
  { id: "werewolf", name: "Werewolf", description: "Hunts villagers at night and tries to remain hidden" },
  { id: "seer", name: "Seer", description: "Can check one player's identity each night" },
  { id: "doctor", name: "Doctor", description: "Can protect one player from being killed each night" },
  { id: "hunter", name: "Hunter", description: "Can take someone down when killed" },
  { id: "witch", name: "Witch", description: "Has one healing potion and one poison potion" },
]

export function CreateGameModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [gameName, setGameName] = useState("My Werewolf Game")
  const [isPublic, setIsPublic] = useState(true)
  const [wolfRatio, setWolfRatio] = useState([25]) // Percentage of werewolves
  const [playerCount, setPlayerCount] = useState("8")
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["villager", "werewolf", "seer"])

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, roleId])
    } else {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId))
    }
  }

  const handleCreateGame = () => {
    // In a real app, this would create a game on the server
    console.log("Creating game with settings:", {
      name: gameName,
      isPublic,
      wolfRatio: wolfRatio[0],
      playerCount,
      roles: selectedRoles,
    })

    // Generate a mock game ID
    const gameId = `game-${Math.random().toString(36).substring(2, 8)}`

    onOpenChange(false)
    router.push(`/waiting-room/${gameId}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Game</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="game-name" className="text-right">
              Game Name
            </Label>
            <Input
              id="game-name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="visibility" className="text-right">
              Public Game
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch id="visibility" checked={isPublic} onCheckedChange={setIsPublic} />
              <span className="text-sm text-gray-500">
                {isPublic ? "Anyone can join with the code" : "Only invited players can join"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="player-count" className="text-right">
              Player Count
            </Label>
            <Select value={playerCount} onValueChange={setPlayerCount}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select player count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Players</SelectItem>
                <SelectItem value="8">8 Players</SelectItem>
                <SelectItem value="10">10 Players</SelectItem>
                <SelectItem value="12">12 Players</SelectItem>
                <SelectItem value="16">16 Players</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="wolf-ratio" className="text-right">
              Wolf Ratio
            </Label>
            <div className="col-span-3 px-2">
              <Slider id="wolf-ratio" value={wolfRatio} onValueChange={setWolfRatio} max={50} step={5} />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Few Wolves ({wolfRatio}%)</span>
                <span>Many Wolves</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-2">
            <Label className="text-right pt-2">Select Roles</Label>
            <div className="col-span-3 space-y-3">
              {availableRoles.map((role) => (
                <div key={role.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, checked as boolean)}
                    disabled={role.id === "villager" || role.id === "werewolf"}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`role-${role.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {role.name}
                    </label>
                    <p className="text-xs text-gray-500">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreateGame} className="bg-red-600 hover:bg-red-700">
            Create Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
