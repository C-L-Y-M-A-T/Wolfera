"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { useTheme } from "@/providers/theme-provider";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface CreateGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGame: (gameSettings: any) => void;
}

export function CreateGameModal({
  open,
  onOpenChange,
  onCreateGame,
}: CreateGameModalProps) {
  const theme = useTheme();
  const { getRoleBorderClass, getRoleColorClass, getRoleIcon } =
    useRoleStyles();
  const [activeTab, setActiveTab] = useState("basic");
  const [gameSettings, setGameSettings] = useState({
    name: "Night Hunt",
    isPublic: true,
    maxPlayers: 12,
    roles: {
      werewolf: 2,
      villager: 6,
      seer: 1,
      doctor: 1,
      hunter: 1,
      witch: 1,
    },
    timers: {
      nightDuration: 60,
      dayDuration: 120,
      discussionTime: 180,
      votingTime: 60,
    },
  });

  const handleRoleChange = (role: string, change: number) => {
    const newCount = Math.max(
      0,
      gameSettings.roles[role as keyof typeof gameSettings.roles] + change,
    );
    setGameSettings((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: newCount,
      },
    }));
  };

  const handleTimerChange = (timer: string, value: number[]) => {
    setGameSettings((prev) => ({
      ...prev,
      timers: {
        ...prev.timers,
        [timer]: value[0],
      },
    }));
  };

  const handleCreateGame = () => {
    onCreateGame(gameSettings);
    onOpenChange(false);
  };

  const totalPlayers = Object.values(gameSettings.roles).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[600px] bg-gray-900 border-gray-700 max-h-[80vh] overflow-y-auto ${theme.typography.textColor.primary}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-red-400">
            Create New Game
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="timers">Timers</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="game-name">Game Name</Label>
              <Input
                id="game-name"
                value={gameSettings.name}
                onChange={(e) =>
                  setGameSettings({ ...gameSettings, name: e.target.value })
                }
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="public-game"
                checked={gameSettings.isPublic}
                onCheckedChange={(checked) =>
                  setGameSettings({ ...gameSettings, isPublic: !!checked })
                }
              />
              <Label htmlFor="public-game">Make this game public</Label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="max-players">
                  Maximum Players: {gameSettings.maxPlayers}
                </Label>
              </div>
              <Slider
                id="max-players"
                min={4}
                max={20}
                step={1}
                value={[gameSettings.maxPlayers]}
                onValueChange={(value) =>
                  setGameSettings({ ...gameSettings, maxPlayers: value[0] })
                }
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>4</span>
                <span>20</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-300">
                Role Distribution
              </h3>
              <div className="text-sm text-gray-400">
                Total: {totalPlayers} players
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(gameSettings.roles).map(([role, count]) => (
                <div
                  key={role}
                  className={`p-4 rounded-lg border ${getRoleColorClass(role)} backdrop-blur-sm ${getRoleBorderClass(role)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      <span className="font-medium capitalize">
                        {role === "werewolves" ? "Werewolves" : role}
                      </span>
                    </div>
                    <div className="text-lg font-bold">{count}</div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(role, -1)}
                      disabled={count === 0}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-lg font-bold w-8 text-center">
                      {count}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(role, 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timers" className="space-y-4">
            {Object.entries(gameSettings.timers).map(([timer, value]) => (
              <div key={timer} className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor={timer}>
                    {timer
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .replace("Duration", " Duration")}
                    : {value} seconds
                  </Label>
                </div>
                <Slider
                  id={timer}
                  min={30}
                  max={300}
                  step={10}
                  value={[value]}
                  onValueChange={(val) => handleTimerChange(timer, val)}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>30s</span>
                  <span>5m</span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGame}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700"
          >
            Create Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
