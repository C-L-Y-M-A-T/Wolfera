// lib/fonts.js
import { Creepster, Inter } from "next/font/google";

// Define our main font (Inter)
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Define our display font (Creepster - a spooky font for horror theme)
export const creepster = Creepster({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-creepster",
});

// Export fonts for easy access
export const fonts = {
  inter,
  creepster,
};

export default fonts;
