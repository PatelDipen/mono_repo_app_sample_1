import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  return {
    plugins: [react()],
    define: {
      "process.env.TAMAGUI_TARGET": JSON.stringify("web"),
      "process.env.VITE_OPENWEATHER_API_KEY": JSON.stringify(
        env.VITE_OPENWEATHER_API_KEY ?? "",
      ),
      "process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY": JSON.stringify(
        env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "",
      ),
    },
    resolve: {
      alias: {
        "react-native": "react-native-web",
        "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
        "@repo/app": path.resolve(__dirname, "../../packages/app/src"),
        "@repo/api": path.resolve(__dirname, "../../packages/api/src"),
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
  };
});
