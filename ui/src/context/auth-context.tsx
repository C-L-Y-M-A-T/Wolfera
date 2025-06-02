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
  fetchUser: () => Promise<AppUser | null>;
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
      const { data, error } = await api.auth.profile(token); // Automatically uses Authorization header
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

  const fetchUser = async (): Promise<AppUser | null> => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      return null;
    }
    const { data, error } = await api.auth.profile(token);
    if (data) {
      setUser(data as AppUser);
      return data as AppUser;
    } else {
      console.warn("Failed to fetch user with token.");
      localStorage.removeItem("access_token");
      setUser(null);
      return null;
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    const { data, error } = await api.auth.profile(token);
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
    <AuthContext.Provider
      value={{ user, checkingSession, login, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
