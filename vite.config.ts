import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Inject the Google Search Console verification meta tag into the static HTML
// <head> at build time, but only when VITE_GOOGLE_SITE_VERIFICATION is set.
// Doing it here (rather than via Vite's `%VITE_*%` substitution) keeps a broken
// tag with an empty `content` from being emitted when the var is absent.
function googleSiteVerification(token: string): Plugin {
  return {
    name: "google-site-verification",
    transformIndexHtml() {
      if (!token) return [];
      return [
        {
          tag: "meta",
          attrs: { name: "google-site-verification", content: token },
          injectTo: "head",
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteVerification = (env.VITE_GOOGLE_SITE_VERIFICATION ?? "").trim();

  return {
  plugins: [react(), googleSiteVerification(siteVerification)],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "./",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  };
});
