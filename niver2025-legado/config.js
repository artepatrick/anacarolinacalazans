// Environment configuration
const config = {
  // Environment detection
  env: import.meta.env.MODE || "development",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // URLs and Endpoints
  urls: {
    base: import.meta.env.PROD
      ? `${window.location.origin}/niver2025`
      : "http://localhost:3000/niver2025",
    api: import.meta.env.PROD
      ? `${window.location.origin}/niver2025/api`
      : "http://localhost:3001/api",
    callback: import.meta.env.PROD
      ? `${window.location.origin}/niver2025/callback`
      : "http://localhost:3000/niver2025/callback",
  },

  // Services configuration
  supabase: {
    url: "",
    anonKey: "",
  },
  spotify: {
    clientId: "",
    redirectUri: `${window.location.origin}/niver2025/callback`,
    scopes: [
      "user-read-private",
      "user-read-email",
      "playlist-modify-public",
      "playlist-modify-private",
    ],
  },
};

export default config;
