// Configuração centralizada do projeto
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

// Configuração do ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config({ path: join(__dirname, "../.env") });

// Configuração base
const config = {
  // Ambiente
  env: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV !== "production",
  isProduction: process.env.NODE_ENV === "production",

  // URLs e Endpoints
  urls: {
    base:
      process.env.NODE_ENV === "production"
        ? "https://anacarolinacalazans.com.br/niver2025"
        : "http://localhost:3000/niver2025",
    api:
      process.env.NODE_ENV === "production"
        ? "https://anacarolinacalazans.com.br/niver2025/api"
        : "http://localhost:3001/api",
    callback:
      process.env.NODE_ENV === "production"
        ? "https://anacarolinacalazans.com.br/niver2025/callback"
        : "http://localhost:3000/niver2025/callback",
  },

  // Spotify
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    playlistId: process.env.SPOTIFY_PLAYLIST_ID,
    scopes: [
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-modify-private",
    ],
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },

  // Servidor
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost",
  },
};

// Validação de configuração
function validateConfig() {
  const requiredEnvVars = [
    "SPOTIFY_CLIENT_ID",
    "SPOTIFY_CLIENT_SECRET",
    "SPOTIFY_REDIRECT_URI",
    "SPOTIFY_PLAYLIST_ID",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error("❌ Variáveis de ambiente obrigatórias não encontradas:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    throw new Error(
      "Configuração incompleta. Verifique as variáveis de ambiente."
    );
  }

  console.log("✅ Configuração validada com sucesso!");
}

// Executa validação em ambiente de desenvolvimento
if (config.isDevelopment) {
  validateConfig();
}

export default config;
