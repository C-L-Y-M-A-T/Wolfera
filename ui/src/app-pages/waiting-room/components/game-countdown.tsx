"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { useTheme } from "@/providers/theme-provider"
import AnimatedText from "@/components/animated-text"

interface GameCountdownProps {
  countdown: number
  onCountdownComplete: () => void
  onCountdownUpdate: (count: number) => void
}

export function GameCountdown({ countdown, onCountdownComplete, onCountdownUpdate }: GameCountdownProps) {
  const theme = useTheme()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        onCountdownUpdate(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      onCountdownComplete()
    }
  }, [countdown, onCountdownComplete, onCountdownUpdate])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center"
      >
        {/* Countdown Number */}
        <motion.div
          key={countdown}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative mb-8"
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Countdown Number */}
          <div className="relative text-9xl font-bold text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
            {countdown}
          </div>

          {/* Animated Ring */}
          <motion.div
            className="absolute inset-0 border-4 border-red-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>

        {/* Game Starting Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <AnimatedText
            text="Game Starting..."
            type="blood"
            className="text-4xl font-bold"
            color="text-white"
            size="text-4xl"
          />

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="text-gray-300 text-lg"
          >
            Prepare yourself for the hunt...
          </motion.div>
        </motion.div>

        {/* Atmospheric Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-500/60 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
