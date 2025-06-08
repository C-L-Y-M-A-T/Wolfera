"use client";

import { NotificationIconType } from "@/lib/theme/notification-icons";
import { useCallback, useEffect, useRef, useState } from "react";

export interface SystemNotificationData {
  id: string;
  title: string;
  message: string;
  type:
    | "info"
    | "warning"
    | "success"
    | "error"
    | "phase"
    | "role"
    | "elimination";
  duration?: number;
  iconType?: NotificationIconType;
  iconClassName?: string;
  priority?: "low" | "normal" | "high" | "critical";
  persistent?: boolean; // Won't auto-dismiss
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "default" | "destructive" | "outline";
}

interface NotificationWithTimer extends SystemNotificationData {
  timerId?: NodeJS.Timeout;
  isExpired?: boolean;
  createdAt: number;
}

interface NotificationQueueOptions {
  maxNotifications?: number;
  defaultDuration?: number;
  groupSimilar?: boolean;
  soundEnabled?: boolean;
}

export function useNotificationQueue(options: NotificationQueueOptions = {}) {
  const {
    maxNotifications = 5,
    defaultDuration = 5000,
    groupSimilar = true,
    soundEnabled = false,
  } = options;

  const [notifications, setNotifications] = useState<NotificationWithTimer[]>(
    [],
  );
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sound if enabled
  useEffect(() => {
    if (soundEnabled && typeof window !== "undefined") {
      soundRef.current = new Audio("/notification-sound.mp3"); // Add your sound file
      soundRef.current.volume = 0.3;
    }
  }, [soundEnabled]);

  // Generate unique ID with better entropy
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(
    (type: SystemNotificationData["type"]) => {
      if (!soundEnabled || !soundRef.current) return;

      try {
        // Different sounds for different types
        const soundMap = {
          success: "/sounds/success.mp3",
          error: "/sounds/error.mp3",
          warning: "/sounds/warning.mp3",
          info: "/sounds/info.mp3",
          phase: "/sounds/phase.mp3",
          role: "/sounds/role.mp3",
          elimination: "/sounds/elimination.mp3",
        };

        soundRef.current.src = soundMap[type] || soundMap.info;
        soundRef.current.play().catch(() => {
          // Ignore play errors (user hasn't interacted with page yet)
        });
      } catch (error) {
        console.warn("Failed to play notification sound:", error);
      }
    },
    [soundEnabled],
  );

  // Check if notifications are similar for grouping
  const areSimilar = useCallback(
    (a: SystemNotificationData, b: SystemNotificationData) => {
      return (
        a.type === b.type &&
        a.title === b.title &&
        Math.abs(Date.now() - (a as NotificationWithTimer).createdAt) < 5000 // Within 5 seconds
      );
    },
    [],
  );

  // Priority-based sorting
  const sortByPriority = useCallback(
    (notifications: NotificationWithTimer[]) => {
      const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
      return [...notifications].sort((a, b) => {
        const aPriority = priorityOrder[a.priority || "normal"];
        const bPriority = priorityOrder[b.priority || "normal"];
        return bPriority - aPriority;
      });
    },
    [],
  );

  // Enhanced add notification with better logic
  const addNotification = useCallback(
    (notification: Omit<SystemNotificationData, "id">) => {
      const id = generateId();
      const now = Date.now();

      const newNotification: NotificationWithTimer = {
        ...notification,
        id,
        duration: notification.persistent
          ? undefined
          : (notification.duration ?? defaultDuration),
        priority: notification.priority || "normal",
        createdAt: now,
      };

      setNotifications((prev) => {
        let updatedNotifications = [...prev];

        // Group similar notifications if enabled
        if (groupSimilar) {
          const similarIndex = updatedNotifications.findIndex((n) =>
            areSimilar(n, newNotification),
          );

          if (similarIndex !== -1) {
            // Update existing similar notification
            const existing = updatedNotifications[similarIndex];
            const timerId = timerRefs.current.get(existing.id);
            if (timerId) {
              clearTimeout(timerId);
              timerRefs.current.delete(existing.id);
            }

            updatedNotifications[similarIndex] = {
              ...existing,
              message: `${existing.message} (${
                updatedNotifications.filter((n) => areSimilar(n, existing))
                  .length + 1
              })`,
              createdAt: now,
            };

            // Reset timer for updated notification
            if (updatedNotifications[similarIndex].duration) {
              const newTimerId = setTimeout(() => {
                setNotifications((prev) =>
                  prev.map((n) =>
                    n.id === existing.id ? { ...n, isExpired: true } : n,
                  ),
                );
                timerRefs.current.delete(existing.id);
                setTimeout(() => removeNotification(existing.id), 500);
              }, updatedNotifications[similarIndex].duration);

              timerRefs.current.set(existing.id, newTimerId);
            }

            return sortByPriority(updatedNotifications);
          }
        }

        // Add new notification
        updatedNotifications.push(newNotification);

        // Enforce max notifications limit
        if (updatedNotifications.length > maxNotifications) {
          const removed = updatedNotifications.splice(
            0,
            updatedNotifications.length - maxNotifications,
          );
          removed.forEach((n) => {
            const timerId = timerRefs.current.get(n.id);
            if (timerId) {
              clearTimeout(timerId);
              timerRefs.current.delete(n.id);
            }
          });
        }

        return sortByPriority(updatedNotifications);
      });

      // Set up auto-dismiss timer for non-persistent notifications
      if (
        newNotification.duration &&
        newNotification.duration > 0 &&
        !newNotification.persistent
      ) {
        const timerId = setTimeout(() => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isExpired: true } : n)),
          );

          timerRefs.current.delete(id);

          // Remove notification after animation completes
          setTimeout(() => {
            removeNotification(id);
          }, 500);
        }, newNotification.duration);

        timerRefs.current.set(id, timerId);
      }

      // Play sound for new notification
      playNotificationSound(newNotification.type);

      return id;
    },
    [
      generateId,
      defaultDuration,
      groupSimilar,
      areSimilar,
      sortByPriority,
      maxNotifications,
      playNotificationSound,
    ],
  );

  // Enhanced remove notification
  const removeNotification = useCallback((id: string) => {
    const timerId = timerRefs.current.get(id);
    if (timerId) {
      clearTimeout(timerId);
      timerRefs.current.delete(id);
    }

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Remove notifications by type
  const removeNotificationsByType = useCallback(
    (type: SystemNotificationData["type"]) => {
      setNotifications((prev) => {
        const toRemove = prev.filter((n) => n.type === type);
        toRemove.forEach((n) => {
          const timerId = timerRefs.current.get(n.id);
          if (timerId) {
            clearTimeout(timerId);
            timerRefs.current.delete(n.id);
          }
        });
        return prev.filter((n) => n.type !== type);
      });
    },
    [],
  );

  // Clear all notifications with optional type filter
  const clearAllNotifications = useCallback(
    (type?: SystemNotificationData["type"]) => {
      if (type) {
        removeNotificationsByType(type);
        return;
      }

      // Clear all timers
      timerRefs.current.forEach((timerId) => clearTimeout(timerId));
      timerRefs.current.clear();

      setNotifications([]);
    },
    [removeNotificationsByType],
  );

  // Mark as expired
  const markAsExpired = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isExpired: true } : n)),
    );
  }, []);

  // Pause/resume all timers (useful for when user is inactive)
  const pauseTimers = useCallback(() => {
    // Implementation would depend on storing remaining time
    // This is a placeholder for the concept
  }, []);

  const resumeTimers = useCallback(() => {
    // Implementation would depend on restoring remaining time
    // This is a placeholder for the concept
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback(
    (type: SystemNotificationData["type"]) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications],
  );

  // Get notification counts
  const notificationCounts = useCallback(() => {
    return notifications.reduce(
      (acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      },
      {} as Record<SystemNotificationData["type"], number>,
    );
  }, [notifications]);

  // Convenience methods for different notification types
  const addSuccess = useCallback(
    (
      title: string,
      message: string,
      options?: Partial<SystemNotificationData>,
    ) => addNotification({ ...options, type: "success", title, message }),
    [addNotification],
  );

  const addError = useCallback(
    (
      title: string,
      message: string,
      options?: Partial<SystemNotificationData>,
    ) => addNotification({ ...options, type: "error", title, message }),
    [addNotification],
  );

  const addWarning = useCallback(
    (
      title: string,
      message: string,
      options?: Partial<SystemNotificationData>,
    ) => addNotification({ ...options, type: "warning", title, message }),
    [addNotification],
  );

  const addInfo = useCallback(
    (
      title: string,
      message: string,
      options?: Partial<SystemNotificationData>,
    ) => addNotification({ ...options, type: "info", title, message }),
    [addNotification],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timerRefs.current.forEach((timerId) => clearTimeout(timerId));
      timerRefs.current.clear();
    };
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    removeNotificationsByType,
    clearAllNotifications,
    markAsExpired,
    pauseTimers,
    resumeTimers,
    getNotificationsByType,
    notificationCounts,
    // Convenience methods
    addSuccess,
    addError,
    addWarning,
    addInfo,
  };
}
