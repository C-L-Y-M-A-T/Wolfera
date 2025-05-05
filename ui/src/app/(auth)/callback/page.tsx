"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { callback } from "../../../../api/authService";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        console.error("Missing tokens");
        return router.replace("/login");
      }

      try {
        await callback(access_token, refresh_token);
        router.replace("/dashboard");
      } catch (error) {
        console.error("Callback failed", error);
        router.replace("/login");
      }
    })();
  }, [router]);

  return <p>Signing you in…</p>;
}
