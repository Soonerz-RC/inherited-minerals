import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  test: {
    environment: "jsdom",
    include: [
      "client/src/**/*.test.ts",
      "client/src/**/*.test.tsx",
      // Tests live in netlify/functions-tests (NOT netlify/functions) because
      // Netlify deploys every file under the functions dir and rejects dotted
      // names like `foo.test.mjs`.
      "netlify/functions-tests/**/*.test.mjs",
    ],
  },
});
