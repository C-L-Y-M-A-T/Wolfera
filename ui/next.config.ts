// next.config.ts
import { loadEnvConfig } from "@next/env";
import { NextConfig } from "next";
import path from "path";

// Load env from parent directory
loadEnvConfig(path.resolve(__dirname, ".."));

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.ts",
      },
    },
  },
  env: {
    UI_BASE_URL: process.env.UI_BASE_URL,
    API_BASE_URL: process.env.API_BASE_URL,
  },
};

export default nextConfig;
