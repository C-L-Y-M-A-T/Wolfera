// lib/theme.js

// Color schemes for the game
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
  },
};

// Typography styles
export const typography = {
  fontFamily: {
    main: "var(--font-inter)", // Using Next.js font system
    display: "var(--font-creepster)", // For titles and important text
  },

  // Font sizes with responsive modifiers
  fontSize: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
    "7xl": "text-7xl",
    "8xl": "text-8xl",
    "9xl": "text-9xl",
  },

  // Font weight
  fontWeight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  },
};

// Animation presets
export const animations = {
  transitions: {
    fast: "transition-all duration-200",
    default: "transition-all duration-300",
    slow: "transition-all duration-500",
  },
  hover: {
    grow: "hover:scale-105",
    pulse: "hover:animate-pulse",
    subtle: "hover:brightness-110",
    glow: "hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  },
  entrance: {
    fadeIn: "animate-fadeIn",
    slideUp: "animate-slideUp",
    slideDown: "animate-slideDown",
    popIn: "animate-popIn",
  },
};

// Spacing constants
export const spacing = {
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",

  // Margin variations
  mxs: "m-1",
  msm: "m-2",
  mmd: "m-4",
  mlg: "m-6",
  mxl: "m-8",
};

// Game-specific styling constants
export const gameStyles = {
  cards: {
    default:
      "bg-slate-800/60 backdrop-blur-md p-6 rounded-xl border border-slate-700/50 shadow-lg",
    highlighted:
      "bg-slate-800/60 backdrop-blur-md p-6 rounded-xl border border-red-500/50 shadow-lg shadow-red-500/20",
    role: "bg-slate-800/80 backdrop-blur-md p-4 rounded-lg border border-slate-700 shadow-md",
  },
  buttons: {
    primary:
      "bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md shadow-red-900/20 hover:shadow-red-900/30",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded shadow-md",
    ghost:
      "bg-transparent hover:bg-slate-800 text-white font-bold py-2 px-4 rounded",
    danger:
      "bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded shadow-md",
  },
  inputs: {
    default:
      "bg-slate-800 border border-slate-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500",
  },
  modals: {
    overlay: "bg-black/80 backdrop-blur-sm",
    content:
      "bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-red-900/10",
  },
  effects: {
    bloodSplatter:
      "before:absolute before:inset-0 before:bg-red-900/10 before:rounded-full before:blur-3xl",
    moonGlow:
      "before:absolute before:inset-0 before:bg-purple-900/20 before:rounded-full before:blur-3xl",
    textShadow: "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  },
};

// Responsive breakpoints references
export const breakpoints = {
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
  "2xl": "2xl:",
};

// Helper to combine multiple style classes
export const cx = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Apply role-based colors
export const getRoleColor = (role) => {
  return colors.roles[role] || colors.roles.villager;
};

// Export all theme elements
export const theme = {
  colors,
  typography,
  animations,
  spacing,
  gameStyles,
  breakpoints,
  cx,
  getRoleColor,
};

export default theme;
