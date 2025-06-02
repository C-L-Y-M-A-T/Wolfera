import { ClientLayout } from "@/components";
import { Toaster } from "@/components/ui";
import { AuthProvider } from "@/context/auth-context";
import { creepster, inter } from "@/lib/fonts";
import type { Metadata } from "next";
import type React from "react";

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
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ClientLayout>
    </html>
  );
}
