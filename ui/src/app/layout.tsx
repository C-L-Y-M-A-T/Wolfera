import { ClientLayout } from "@/components";
import type { Metadata } from "next";
import type React from "react";
import "../../styles/globals.css";

export const metadata: Metadata = {
  title: "Wolfera",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark" style={{ colorScheme: "dark" }}>
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
