"use client";

import { getSupabaseFrontendClient } from "@/services/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton: React.FC = () => {
  const supabase = getSupabaseFrontendClient();
  const router = useRouter();

  const handleLogout = () => {
    supabase.auth.signOut().then(({ error }) => {
      if (error) {
        console.error("Error logging out:", error.message);
      } else {
        console.log("Logged out successfully");
        router.push("/");
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
