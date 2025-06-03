"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedContainerProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function AnimatedContainer({ children, delay = 0, direction = "up", className = "" }: AnimatedContainerProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 20 }
      case "down":
        return { opacity: 0, y: -20 }
      case "left":
        return { opacity: 0, x: 20 }
      case "right":
        return { opacity: 0, x: -20 }
      default:
        return { opacity: 0, y: 20 }
    }
  }

  const getAnimatePosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 1, y: 0 }
      case "down":
        return { opacity: 1, y: 0 }
      case "left":
        return { opacity: 1, x: 0 }
      case "right":
        return { opacity: 1, x: 0 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={getAnimatePosition()}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
