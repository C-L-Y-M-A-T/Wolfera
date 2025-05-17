// lib/theme/effects.ts
export const effects = {
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    red: {
      sm: "shadow-sm shadow-red-900/10",
      md: "shadow-md shadow-red-900/20",
      lg: "shadow-lg shadow-red-900/20",
    },
    yellow: {
      sm: "shadow-sm shadow-yellow-900/10",
      md: "shadow-md shadow-yellow-900/20",
      lg: "shadow-lg shadow-yellow-500/20",
    },
  },
  blurs: {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  },
  glows: {
    red: "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]",
    yellow: "drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]",
    blue: "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    purple: "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]",
  },
}
