"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login, signup } from "../api/authService";

export const useAuth = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signup(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSignup,
    handleLogin,
    error,
    loading,
  };
};
