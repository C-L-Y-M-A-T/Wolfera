"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { SystemNotificationData } from "@/hooks/use-notification-queue";
import { getNotificationIcon } from "@/lib/theme/notification-icons";
import { useTheme } from "@/providers/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Crown,
  Info,
  Skull,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState, useCallback, useMemo, forwardRef } from "react";

interface SystemNotificationProps {
  notification: SystemNotificationData & { isExpired?: boolean };
  onDismiss: () => void;
  index: number;
  total: number;
}

// Notification configuration with improved typing
const getNotificationConfig = (type: SystemNotificationData["type"]) => {
  const configs = {
    success: {
      bg: "bg-gradient-to-br from-emerald-900/95 to-emerald-800/95",
      border: "border-emerald-400/60",
      text: "text-emerald-50",
      accent: "text-emerald-300",
      icon: <CheckCircle className="h-6 w-6 text-emerald-400" />,
      glow: "shadow-emerald-500/20",
      particle: "bg-emerald-400",
    },
    error: {
      bg: "bg-gradient-to-br from-red-900/95 to-red-800/95",
      border: "border-red-400/60",
      text: "text-red-50",
      accent: "text-red-300",
      icon: <AlertCircle className="h-6 w-6 text-red-400" />,
      glow: "shadow-red-500/20",
      particle: "bg-red-400",
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-900/95 to-amber-800/95",
      border: "border-amber-400/60",
      text: "text-amber-50",
      accent: "text-amber-300",
      icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
      glow: "shadow-amber-500/20",
      particle: "bg-amber-400",
    },
    phase: {
      bg: "bg-gradient-to-br from-violet-900/95 to-indigo-900/95",
      border: "border-violet-400/60",
      text: "text-violet-50",
      accent: "text-violet-300",
      icon: <Zap className="h-6 w-6 text-violet-400" />,
      glow: "shadow-violet-500/20",
      particle: "bg-violet-400",
    },
    role: {
      bg: "bg-gradient-to-br from-blue-900/95 to-cyan-900/95",
      border: "border-blue-400/60",
      text: "text-blue-50",
      accent: "text-blue-300",
      icon: <Crown className="h-6 w-6 text-blue-400" />,
      glow: "shadow-blue-500/20",
      particle: "bg-blue-400",
    },
    elimination: {
      bg: "bg-gradient-to-br from-red-950/95 to-slate-900/95",
      border: "border-red-500/60",
      text: "text-red-50",
      accent: "text-red-300",
      icon: <Skull className="h-6 w-6 text-red-400" />,
      glow: "shadow-red-600/30",
      particle: "bg-red-500",
    },
    info: {
      bg: "bg-gradient-to-br from-slate-900/95 to-slate-800/95",
      border: "border-slate-400/60",
      text: "text-slate-50",
      accent: "text-slate-300",
      icon: <Info className="h-6 w-6 text-slate-400" />,
      glow: "shadow-slate-500/20",
      particle: "bg-slate-400",
    },
  } as const;

  return configs[type] || configs.info;
};

// Animation variants moved outside component for performance
const containerVariants = {
  initial: {
    opacity: 0,
    scale: 0.85,
    y: -30,
    rotateX: -10,
  },
  animate: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: index * 8,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: index * 0.08,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
  dismiss: {
    opacity: 0,
    scale: 0.8,
    x: 400,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const iconVariants = {
  initial: { scale: 0, rotate: -90 },
  animate: (index: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 20,
      delay: index * 0.08 + 0.15,
    },
  }),
};

const contentVariants = {
  initial: { opacity: 0, x: -15 },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.08 + 0.25,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export const SystemNotification = forwardRef<
  HTMLDivElement,
  SystemNotificationProps
>(({ notification, onDismiss, index, total }, ref) => {
  const theme = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(
    notification.duration || 0,
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  // Memoize configuration to prevent recalculation
  const config = useMemo(
    () => getNotificationConfig(notification.type),
    [notification.type],
  );

  // Optimize timer with useCallback
  const updateTimer = useCallback(() => {
    if (!notification.duration || notification.isExpired || isHovered) return;

    setTimeRemaining((prev) => Math.max(0, prev - 100));
  }, [notification.duration, notification.isExpired, isHovered]);

  // Single useEffect for timer management
  useEffect(() => {
    if (!notification.duration || notification.isExpired || isHovered) return;

    const interval = setInterval(updateTimer, 100);
    return () => clearInterval(interval);
  }, [updateTimer]);

  // Optimized dismiss handler
  const handleDismiss = useCallback(() => {
    setIsDismissing(true);
    // Use requestAnimationFrame for smoother animation timing
    requestAnimationFrame(() => {
      setTimeout(onDismiss, 300);
    });
  }, [onDismiss]);

  // Keyboard handling for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleDismiss();
      }
    },
    [handleDismiss],
  );

  // Get appropriate icon with memoization
  const notificationIcon = useMemo(() => {
    if (notification.iconType) {
      return getNotificationIcon(
        notification.iconType,
        notification.iconClassName || "h-6 w-6",
      );
    }
    return config.icon;
  }, [notification.iconType, notification.iconClassName, config.icon]);

  const progressPercentage = useMemo(() => {
    return notification.duration
      ? (timeRemaining / notification.duration) * 100
      : 0;
  }, [notification.duration, timeRemaining]);

  // Optimized hover handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={containerVariants}
      initial="initial"
      animate={isDismissing ? "dismiss" : "animate"}
      exit="exit"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="alert"
      aria-live="polite"
      aria-labelledby={`notification-title-${notification.id}`}
      aria-describedby={`notification-message-${notification.id}`}
      className={`
          ${config.bg} ${config.border} ${config.text}
          backdrop-blur-md border-2 rounded-xl shadow-2xl ${config.glow}
          max-w-md w-full mx-4 mb-4 pointer-events-auto
          relative overflow-hidden cursor-pointer
          transform-gpu perspective-1000
          focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
          transition-transform duration-200 hover:scale-[1.02]
        `}
      style={{
        zIndex: 1000 - index,
      }}
    >
      {/* Optimized background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 ${config.particle} rounded-full opacity-30`}
            animate={{
              x: [0, 80, 0],
              y: [0, -40, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + i * 25}%`,
              top: `${45 + i * 8}%`,
            }}
          />
        ))}
      </div>

      {/* Shimmer effect with reduced frequency */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut",
        }}
      />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Optimized Icon Animation */}
          <motion.div
            custom={index}
            variants={iconVariants}
            className="flex-shrink-0 relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: notification.type === "phase" ? [0, 360] : 0,
              }}
              transition={{
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: notification.type === "phase" ? 3 : 0,
                  repeat: notification.type === "phase" ? Infinity : 0,
                  ease: "linear",
                },
              }}
            >
              {notificationIcon}
            </motion.div>

            {/* Icon glow effect */}
            <div
              className={`absolute inset-0 ${config.particle} rounded-full blur-lg opacity-15 animate-pulse`}
            />
          </motion.div>

          {/* Content with improved accessibility */}
          <motion.div
            custom={index}
            variants={contentVariants}
            className="flex-1 min-w-0"
          >
            <motion.h3
              id={`notification-title-${notification.id}`}
              className={`font-bold text-lg mb-2 ${config.accent}`}
              animate={{
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {notification.title}
            </motion.h3>
            <motion.p
              id={`notification-message-${notification.id}`}
              className="text-sm leading-relaxed opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.3 }}
            >
              {notification.message}
            </motion.p>
          </motion.div>

          {/* Enhanced close button */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              aria-label="Dismiss notification"
              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-white/15 focus:bg-white/20 transition-colors rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Enhanced progress bar */}
        <AnimatePresence>
          {notification.duration && !notification.isExpired && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 text-xs opacity-70 mb-2">
                <span>Auto-dismiss in {Math.ceil(timeRemaining / 1000)}s</span>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-white/60"
                  >
                    (paused)
                  </motion.span>
                )}
              </div>
              <Progress
                value={progressPercentage}
                className="h-1.5 bg-black/20 overflow-hidden"
                aria-label={`Time remaining: ${Math.ceil(timeRemaining / 1000)} seconds`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced special effects */}
      <AnimatePresence>
        {notification.type === "elimination" && (
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/40 to-transparent rounded-bl-full pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {notification.type === "phase" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-violet-500/15 via-transparent to-blue-500/15 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

SystemNotification.displayName = "SystemNotification";
