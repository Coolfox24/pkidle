import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative paths work on both GitHub project pages and custom domains.
  base: "./",
  plugins: [react()],
});
