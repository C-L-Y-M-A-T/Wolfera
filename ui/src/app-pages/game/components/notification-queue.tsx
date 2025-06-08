"use client";

import { SystemNotificationData } from "@/hooks/use-notification-queue";
import { AnimatePresence } from "framer-motion";
import { SystemNotification } from "./system-notification";

interface NotificationQueueProps {
  notifications: (SystemNotificationData & { isExpired?: boolean })[];
  onDismiss: (id: string) => void;
  maxVisible?: number;
}

export function NotificationQueue({
  notifications,
  onDismiss,
  maxVisible = 3,
}: NotificationQueueProps) {
  // Show only the most recent notifications
  const visibleNotifications = notifications.slice(-maxVisible);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="flex flex-col-reverse items-center">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map((notification, index) => (
            <SystemNotification
              key={notification.id}
              notification={notification}
              onDismiss={() => onDismiss(notification.id)}
              index={index}
              total={visibleNotifications.length}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Overflow indicator */}
      {notifications.length > maxVisible && (
        <div className="text-center mt-2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-600 rounded-full px-3 py-1 text-xs text-slate-300">
            +{notifications.length - maxVisible} more notifications
          </div>
        </div>
      )}
    </div>
  );
}
