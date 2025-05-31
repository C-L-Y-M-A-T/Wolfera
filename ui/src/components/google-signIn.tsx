"use client";

import api from "@/services/api";
import { getSupabaseFrontendClient } from "@/services/supabase/client";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const OneTapComponent = () => {
  const supabase = getSupabaseFrontendClient();
  const router = useRouter();

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return [nonce, hashedNonce];
  };

  useEffect(() => {
    const initializeGoogleOneTap = async () => {
      console.log("Initializing Google One Tap");

      const [nonce, hashedNonce] = await generateNonce();
      console.log("Nonce: ", nonce, hashedNonce);

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session", error);
      }
      if (data.session) {
        router.push("/");
        return;
      }

      if (typeof window !== "undefined" && window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          callback: async (response: CredentialResponse) => {
            try {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce,
              });
              if (error) {
                console.error("Error signing in with Google", error);
                return;
              }
              api.users.sync(
                data?.session?.access_token || "",
                data?.user?.id,
                data?.user?.email,
                undefined,
                data?.user?.user_metadata?.avatar_url,
              );

              console.log("Session data: ", data);
              router.push("/dashboard");
            } catch (err) {
              console.error("Google One Tap login error", err);
            }
          },
          nonce: hashedNonce,
          use_fedcm_for_prompt: true,
        });
        const gsiButton = document.getElementById("gsi-button");
        if (gsiButton) {
          window.google.accounts.id.renderButton(gsiButton, {
            theme: "outline", // or "filled_blue", "filled_black"
            size: "large", // or "medium", "small"
            type: "standard", // or "icon"
            shape: "pill", // or "rectangular", "circle"
            logo_alignment: "left",
          });
        } else {
          console.error("GSI button element not found");
        }

        window.google.accounts.id.prompt();
      } else {
        console.error("Google accounts API not available yet");
      }
    };

    initializeGoogleOneTap();
  }, []);

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="gsi-button" className="mt-4" />
    </>
  );
};

export default OneTapComponent;
