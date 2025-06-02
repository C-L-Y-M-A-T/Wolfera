import { useEffect } from "react";
import { useToast } from "./use-toast";

export function useNotificationStream(userId: string) {
  const toast = useToast();
  const baseURL = process.env.API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!userId) return;

    const streamUrl = `${baseURL}/notifications/${userId}/stream`;
    const eventSource = new EventSource(streamUrl);

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
      // Optionally: eventSource.close(); and retry logic here
    };

    return () => {
      eventSource.close();
      fetch(`${baseURL}/notifications/${userId}/disconnect`, {
        method: "POST",
      }).catch(() => {
        console.warn("Failed to notify server of SSE disconnect.");
      });
    };
  }, [userId, baseURL]);
}
