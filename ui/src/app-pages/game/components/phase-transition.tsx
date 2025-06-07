"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRoleStyles } from "@/hooks/use-role-styles";
import { Moon, Sun, Skull } from "lucide-react";
import { Player } from "../game-page";

interface PhaseTransitionProps {
  type: "day-to-night" | "night-to-day" | "elimination" | null;
  eliminatedPlayer?: Player | null;
  onComplete: () => void;
}

export function PhaseTransition({
  type,
  eliminatedPlayer,
  onComplete,
}: PhaseTransitionProps) {
  const { getRoleIcon, getRoleColorClass } = useRoleStyles();

  if (!type) return null;

  const getTransitionContent = () => {
    switch (type) {
      case "day-to-night":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.5 }}
            className="text-center"
            onAnimationComplete={onComplete}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <Moon className="h-24 w-24 text-indigo-400 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Night Falls</h2>
            <p className="text-xl text-indigo-300">
              The village sleeps while darkness awakens...
            </p>
          </motion.div>
        );

      case "night-to-day":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.5 }}
            className="text-center"
            onAnimationComplete={onComplete}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <Sun className="h-24 w-24 text-amber-400 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Dawn Breaks</h2>
            <p className="text-xl text-amber-300">
              A new day begins in the village...
            </p>
          </motion.div>
        );

      case "elimination":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 3 }}
            className="text-center"
            onAnimationComplete={onComplete}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: 1,
                ease: "easeInOut",
              }}
            >
              <Skull className="h-24 w-24 text-red-400 mx-auto mb-6" />
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-6">
              The Village Has Decided
            </h2>

            {eliminatedPlayer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="bg-slate-800/80 rounded-xl p-6 max-w-md mx-auto"
              >
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-red-600">
                  <AvatarImage
                    src={eliminatedPlayer.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-2xl">
                    {eliminatedPlayer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {eliminatedPlayer.name}
                </h3>
                <p className="text-slate-300 mb-4">
                  has been eliminated by the village
                </p>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-slate-400">Their role was</span>
                  <div
                    className={`flex items-center gap-1 ${getRoleColorClass(eliminatedPlayer.role)}`}
                  >
                    {getRoleIcon(eliminatedPlayer.role)}
                    <span className="font-bold">{eliminatedPlayer.role}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  const getBackgroundGradient = () => {
    switch (type) {
      case "day-to-night":
        return "from-amber-900/20 via-indigo-900/40 to-slate-900/80";
      case "night-to-day":
        return "from-indigo-900/20 via-amber-900/40 to-slate-900/80";
      case "elimination":
        return "from-red-900/20 via-slate-900/60 to-slate-900/80";
      default:
        return "from-slate-900/60 to-slate-900/80";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b ${getBackgroundGradient()} backdrop-blur-sm`}
      >
        {getTransitionContent()}
      </motion.div>
    </AnimatePresence>
  );
}
