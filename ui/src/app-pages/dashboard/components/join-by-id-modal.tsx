"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/providers/theme-provider";
import { useState } from "react";

interface JoinByIdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinGame: (gameId: string) => void;
}

export function JoinByIdModal({
  open,
  onOpenChange,
  onJoinGame,
}: JoinByIdModalProps) {
  const theme = useTheme();
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");

  const handleJoinGame = () => {
    if (!gameId.trim()) {
      setError("Please enter a game ID");
      return;
    }

    // In a real app, you would validate the game ID here
    onJoinGame(gameId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[425px] bg-gray-900 border-gray-700 `}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-400">
            Join Game by ID
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="game-id"
              className={`${theme.typography.textColor.primary}`}
            >
              Game ID
            </Label>
            <Input
              id="game-id"
              value={gameId}
              onChange={(e) => {
                setGameId(e.target.value);
                setError("");
              }}
              placeholder="Enter the game ID"
              className={`bg-gray-800 border-gray-700 ${theme.typography.textColor.primary}`}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          <div className="text-sm text-gray-400">
            <p>
              Enter the game ID provided by the host to join a private game.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinGame}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700"
          >
            Join Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
