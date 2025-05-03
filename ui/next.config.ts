// next.config.ts
import { loadEnvConfig } from "@next/env";
import { NextConfig } from "next";
import path from "path";

// Load env from parent directory
loadEnvConfig(path.resolve(__dirname, ".."));

const nextConfig: NextConfig = {
  env: {
    UI_BASE_URL: process.env.UI_BASE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
  },
};

export default nextConfig;
