"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, checkingSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until we've checked session
    if (!checkingSession && session === null) {
      router.push("/auth");
    }
  }, [checkingSession, session, router]);

  if (checkingSession) return <p>Loading...</p>;

  return <>{children}</>;
}
