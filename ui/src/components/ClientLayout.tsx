"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/globals.css";
import "../i18n/i18n";
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
    <body className={`min-h-screen bg-background font-sans antialiased`}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </body>
  ) : (
    <body></body>
  );
}
