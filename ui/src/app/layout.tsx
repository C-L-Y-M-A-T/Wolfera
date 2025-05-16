import { ClientLayout } from "@/components";
import { AuthProvider } from "@/context/auth-context";
import type { Metadata } from "next";
import type React from "react";
import { inter, creepster } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Wolfera",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${creepster.variable}`}
    >
      <ClientLayout>
        <AuthProvider>{children}</AuthProvider>
      </ClientLayout>
    </html>
  );
}
