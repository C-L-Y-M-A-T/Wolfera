"use client";

import api from "@/services/api";
import { AvatarConfigType } from "@/types/avatar-builder/avatarConfig";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type AppUser = {
  id: string;
  email: string;
  username: string;
  avatarOptions?: Record<keyof AvatarConfigType, number>;
  created_at: string;
};

type AuthContextType = {
  user: AppUser | null;
  checkingSession: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setCheckingSession(false);
      return;
    }

    const fetchUser = async () => {
      const { data, error } = await api.auth.profile(); // Automatically uses Authorization header
      if (data) {
        setUser(data as AppUser);
      } else {
        console.warn("Invalid token or failed to fetch user.");
        localStorage.removeItem("access_token");
        setUser(null);
      }
      setCheckingSession(false);
    };

    fetchUser();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    const { data, error } = await api.auth.profile();
    if (data) {
      setUser(data as AppUser);
    } else {
      localStorage.removeItem("access_token");
      setUser(null);
      throw new Error("Failed to fetch user with token");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, checkingSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
