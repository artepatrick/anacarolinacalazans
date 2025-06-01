import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3000,
      clientPort: 3000,
    },
  },
  define: {
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
});
