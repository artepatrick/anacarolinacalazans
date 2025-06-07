// Configuração do frontend
const config = {
  // Ambiente
  env: import.meta.env.MODE || "development",
  isDevelopment: import.meta.env.MODE !== "production",
  isProduction: import.meta.env.MODE === "production",

  // URLs e Endpoints
  urls: {
    base:
      import.meta.env.MODE === "production"
        ? "https://anacarolinacalazans.com.br/niver2025"
        : "http://localhost:3000/niver2025",
    api:
      import.meta.env.MODE === "production"
        ? "https://anacarolinacalazans.com.br/niver2025/api"
        : "http://localhost:3001/api",
    callback:
      import.meta.env.MODE === "production"
        ? "https://anacarolinacalazans.com.br/niver2025/callback"
        : "http://localhost:3000/niver2025/callback",
  },

  // Spotify
  spotify: {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
    redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    playlistId: import.meta.env.VITE_SPOTIFY_PLAYLIST_ID,
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
    url: import.meta.env.VITE_SUPABASE_URL,
    serviceKey: import.meta.env.VITE_SUPABASE_SERVICE_KEY,
  },
};

export default config;
