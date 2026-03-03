import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.TAMAGUI_TARGET": JSON.stringify("web"),
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
    extensions: [".web.tsx", ".web.ts", ".web.js", ".tsx", ".ts", ".js"],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: [
        ".web.js",
        ".web.jsx",
        ".web.ts",
        ".web.tsx",
        ".mjs",
        ".js",
        ".mts",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
      ],
    },
  },
});
