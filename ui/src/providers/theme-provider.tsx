"use client";

import { createContext, useContext, type ReactNode } from "react";
import theme, { type Theme } from "@/lib/theme/theme-config";

// Create theme context
const ThemeContext = createContext<Theme>(theme);

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  return useContext(ThemeContext);
}
