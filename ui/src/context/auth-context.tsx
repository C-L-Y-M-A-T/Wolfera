"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import api from "@/services/api";
import { getSupabaseFrontendClient } from "@/services/supabase/client";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AppUser = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
};

const AuthContext = createContext<
  | { session: Session | null; checkingSession: boolean; user: AppUser | null }
  | undefined
>(undefined);

const PUBLIC_ROUTES = ["/", "/auth"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = getSupabaseFrontendClient();
  const pathname = usePathname();

  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [user, setUser] = useLocalStorage<AppUser | null>("app-user", null);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isPublic) return;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setCheckingSession(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setCheckingSession(false);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [isPublic, supabase.auth]);

  useEffect(() => {
    if (!session) return;

    const fetchUser = async () => {
      try {
        const data = await api.users.me(session.access_token);
        const profile = data.data;
        if (!profile) {
          console.error("User profile not found");
          return;
        }

        setUser(profile);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUser();
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, checkingSession, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
