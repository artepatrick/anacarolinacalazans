import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: __dirname,
  base: "/niver2025/", // Add base path for production
  define: {
    "import.meta.env.MODE": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
    "import.meta.env.PROD": JSON.stringify(
      process.env.NODE_ENV === "production"
    ),
    "import.meta.env.DEV": JSON.stringify(
      process.env.NODE_ENV !== "production"
    ),
  },
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3000,
      clientPort: 3000,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      "/.netlify/functions": {
        target: "http://localhost:8888",
        changeOrigin: true,
        secure: false,
      },
      "/niver2025/callback": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          vendor: ["@chakra-ui/css"],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "assets/[name][extname]";
          return "assets/[name]-[hash][extname]";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
