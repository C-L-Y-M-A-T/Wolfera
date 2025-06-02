import { EventSourcePolyfill } from "event-source-polyfill";
import { useEffect } from "react";
import { useToast } from "./use-toast";

export function useNotificationStream(userId: string) {
  const toast = useToast();
  const baseURL = process.env.API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("access_token") || "";

    const streamUrl = `${baseURL}/notifications/${userId}/stream`;
    const eventSource = new EventSourcePolyfill(streamUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    eventSource.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse(event.data);
        const { type, title } = data;
        toast.toast({
          title: `[${type.toUpperCase()}]`,
          description: title,
        });
      } catch (err) {
        console.error("Failed to parse notification event:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
    };

    return () => {
      eventSource.close();
      fetch(`${baseURL}/notifications/${userId}/disconnect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {
        console.warn("Failed to notify server of SSE disconnect.");
      });
    };
  }, [userId, baseURL]);
}
