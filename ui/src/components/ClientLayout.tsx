"use client";

import "@/i18n/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/globals.css";
import { ThemeProvider } from "./theme-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n, i18n.language]);

  return mounted ? (
    <body className="font-sans bg-background text-foreground min-h-screen">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="flex flex-col min-h-screen">{children}</div>
      </ThemeProvider>
    </body>
  ) : (
    <body></body>
  );
}
