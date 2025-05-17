// lib/theme/theme-config.ts
import { colors } from "./colors"
import { typography } from "./typography"
import { animations } from "./animations"
import { spacing } from "./spacing"
import { gameStyles } from "./game-styles"
import { breakpoints } from "./breakpoints"
import { effects } from "./effects"
import { variants } from "./variants"

// Helper to combine multiple style classes
export const cx = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

// Apply role-based colors
export const getRoleColor = (role?: string) => {
  if (!role) return colors.roles.villager
  return colors.roles[role as keyof typeof colors.roles] || colors.roles.villager
}

// Export all theme elements
export const theme = {
  colors,
  typography,
  animations,
  spacing,
  gameStyles,
  breakpoints,
  effects,
  variants,
  cx,
  getRoleColor,
}

export type Theme = typeof theme

export default theme
