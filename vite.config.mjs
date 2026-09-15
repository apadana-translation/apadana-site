import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  root: ".",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    manifest: true,
    emptyOutDir: false,
    sourcemap: mode === "development" ? "inline" : true,
    minify: mode !== "development",
    rollupOptions: {
      input: "./src/_assets/main.js",
      output: {
        assetFileNames:
          mode === "development"
            ? "assets/[name][extname]"
            : "assets/[name]-[hash][extname]",
        chunkFileNames:
          mode === "development" ? "assets/[name].js" : "assets/[name]-[hash].js",
        entryFileNames:
          mode === "development" ? "assets/[name].js" : "assets/[name]-[hash].js",
      },
    },
  },
}));
