"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "@/providers/theme-provider";
import { Trophy } from "lucide-react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  date?: string;
}

interface AchievementDetailsDialogProps {
  achievement: Achievement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AchievementDetailsDialog({
  achievement,
  open,
  onOpenChange,
}: AchievementDetailsDialogProps) {
  const theme = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[500px] bg-gray-900 border-gray-700`}>
        <DialogHeader>
          <DialogTitle className="text-yellow-400">
            {achievement.name}
          </DialogTitle>
        </DialogHeader>
        <div
          className={`${theme.typography.fontSize.lg} ${theme.typography.textColor.primary} py-4`}
        >
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Trophy className="h-12 w-12 text-black" />
            </div>
          </div>

          <p className="text-center mb-4">{achievement.description}</p>

          <div className="text-center text-sm text-yellow-400">
            Unlocked on {achievement.date}
          </div>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="font-medium mb-2">Achievement Rarity</h4>
            <p className="text-sm text-gray-400">
              Only 15% of players have unlocked this achievement.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
