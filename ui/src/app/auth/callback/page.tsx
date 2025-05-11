"use client";

import { supabase } from "@/services/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to get session:", error);
        return;
      }

      const accessToken = data.session?.access_token;
      if (accessToken) {
        await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      router.push("/dashboard");
    };

    completeSignIn();
  }, [router]);

  return <p>Signing you in...</p>;
}
