import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: __dirname,
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
      "/niver2025/callback": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "import.meta.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_URL),
    "import.meta.env.SUPABASE_ANON_KEY": JSON.stringify(
      process.env.SUPABASE_ANON_KEY
    ),
    "import.meta.env.TOLKY_API_BASE_URL": JSON.stringify(
      process.env.TOLKY_API_BASE_URL
    ),
    "import.meta.env.TOLKY_REASONING_TOKEN": JSON.stringify(
      process.env.TOLKY_REASONING_TOKEN
    ),
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
