"use client";

import apiClient from "@/utils/apiClient";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}

export default function GoogleSignIn() {
  const router = useRouter();
  useEffect(() => {
    // Define callback before the button loads
    window.handleCredentialResponse = async (response: any) => {
      const credential = response.credential;
      if (!credential) return;

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: credential,
      });

      if (error) {
        console.error("Supabase sign-in error:", error);
      } else {
        console.log("Signed in with Supabase:", data);
        const accessToken = data.session?.access_token;

        if (accessToken) {
          // Call your API to sync user with header authorization bearer token
          await apiClient.post("/auth/sync-user", null, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Optionally store token in cookie for middleware
          document.cookie = `sb-access-token=${accessToken}; path=/; max-age=3600`;
          // Redirect to dashboard or any other page
          router.push("/dashboard");
        }
      }
    };

    // Load GIS script and render the button
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: $`{process.env.GOOGLE_CLIENT_ID}`,
          callback: window.handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("g_id_signin")!,
          {
            type: "standard",
            shape: "pill",
            theme: "outline",
            text: "continue_with",
            size: "large",
            logo_alignment: "left",
          },
        );
      }
    };

    document.head.appendChild(script);
  }, []);

  return <div id="g_id_signin"></div>;
}
