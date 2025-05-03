/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require("dotenv");
const { spawn } = require("child_process");
const path = require("path");

// Load env from parent directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const port = process.env.UI_PORT || "3000";

// Start Next.js with the loaded port
spawn("next", ["dev", "--turbo", "-p", port], {
  stdio: "inherit",
  shell: true,
});
