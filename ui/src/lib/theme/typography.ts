// lib/theme/typography.ts
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

  // Text colors
  textColor: {
    primary: "text-white",
    secondary: "text-gray-300",
    muted: "text-gray-400",
    accent: "text-red-500",
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
    info: "text-blue-400",
    role: {
      villager: "text-sky-500",
      werewolf: "text-red-700",
      seer: "text-purple-500",
      hunter: "text-yellow-500",
      witch: "text-indigo-500",
    },
  },

  // Heading styles
  headings: {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-bold",
    h3: "text-xl font-bold",
    h4: "text-lg font-bold",
    h5: "text-base font-bold",
    h6: "text-sm font-bold",
  },
};
