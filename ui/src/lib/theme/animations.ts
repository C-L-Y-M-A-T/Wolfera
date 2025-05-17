// lib/theme/animations.ts
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
  // Animation variants for framer-motion
  variants: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 },
      },
    },
    card: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 },
      },
    },
  }
};
