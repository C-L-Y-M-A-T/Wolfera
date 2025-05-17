// lib/theme/colors.ts
export const colors = {
  // Primary theme colors
  primary: {
    blood: "#b91c1c", // Deep blood red (red-700)
    bloodLight: "#ef4444", // Lighter blood red (red-500)
    bloodDark: "#7f1d1d", // Darker blood red (red-900)
    moon: "#a855f7", // Purple for moon themes (purple-500)
    forest: "#15803d", // Forest green (green-700)
    night: "#0f172a", // Deep night blue (slate-900)
    fog: "#1e293b", // Foggy dark (slate-800)
    midnight: "#020617", // Midnight black (slate-950)
  },

  // Role-specific colors
  roles: {
    villager: "#0ea5e9", // Sky blue for villagers (sky-500)
    werewolf: "#b91c1c", // Red for werewolves (red-700)
    seer: "#a855f7", // Purple for seers (purple-500)
    doctor: "#10b981", // Green for doctor (emerald-500)
    hunter: "#eab308", // Yellow for hunter (yellow-500)
    witch: "#6366f1", // Indigo for witch (indigo-500)
  },

  // UI element colors
  ui: {
    background: {
      primary: "#0f172a", // Main background (slate-900)
      secondary: "#1e293b", // Secondary background (slate-800)
      contrast: "#7f1d1d", // Contrasting background (red-900)
    },
    text: {
      primary: "#f8fafc", // Primary text (slate-50)
      secondary: "#cbd5e1", // Secondary text (slate-300)
      accent: "#ef4444", // Accent text (red-500)
      muted: "#64748b", // Muted text (slate-500)
    },
    border: {
      primary: "#334155", // Primary border (slate-700)
      accent: "#b91c1c", // Accent border (red-700)
      muted: "#1e293b", // Muted border (slate-800)
    },
  },

  // Gradients
  gradients: {
    bloodMoon: "linear-gradient(to right, #b91c1c, #9d174d)", // red-700 to pink-900
    nightForest: "linear-gradient(to bottom, #0f172a, #15803d)", // slate-900 to green-700
    midnight: "linear-gradient(to bottom, #020617, #1e293b)", // slate-950 to slate-800
    danger: "linear-gradient(to right, #b91c1c, #991b1b)", // red-700 to red-800
    redToRed: "from-red-600 to-red-800 hover:from-red-500 hover:to-red-700",
    redToPurple: "from-red-500 to-purple-600",
    redToRedDark: "from-red-900/80 to-red-700/80",
    yellowToYellowDark: "from-yellow-900/80 to-yellow-700/80",
    blueToBlue: "from-blue-900/80 to-blue-700/80",
    greenToGreen: "from-green-600 to-green-700 hover:from-green-500 hover:to-green-600",
  },

  // CSS classes for role-specific styling
  roleClasses: {
    villager: "text-sky-500 bg-blue-950/50",
    werewolf: "text-red-700 bg-red-950/50",
    seer: "text-purple-500 bg-purple-950/50",
    hunter: "text-yellow-500 bg-yellow-950/50",
    witch: "text-indigo-500 bg-indigo-950/50",
  },

  // Status colors
  status: {
    online: "bg-green-500",
    offline: "bg-gray-500",
    "in-game": "bg-yellow-500",
  },
}
