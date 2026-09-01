import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

function spaFallback(): Plugin {
  return {
    name: "spa-404",
    closeBundle() {
      const dist = path.join(root, "dist");
      const index = path.join(dist, "index.html");
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(dist, "404.html"));
      }
    },
  };
}

const base = process.env.VITE_BASE || "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    spaFallback(),
    VitePWA({
      registerType: "autoUpdate",
      minify: false,
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "QBank",
        short_name: "QBank",
        description: "Filterable interview question bank",
        theme_color: "#12110f",
        background_color: "#12110f",
        display: "standalone",
        start_url: base,
        scope: base,
        icons: [{ src: "favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,ico,woff2}"],
        globIgnores: ["**/assets/*excalidraw*", "**/assets/*monaco*"],
        navigateFallback: "index.html",
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.join(root, "src"),
      "#site/content": path.join(root, ".velite"),
    },
  },
  server: {
    fs: { allow: [root] },
  },
});
