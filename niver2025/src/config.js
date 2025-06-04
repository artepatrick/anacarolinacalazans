// Environment configuration
const config = {
  isDevelopment: import.meta.env.MODE === "development",
  isProduction: import.meta.env.MODE === "production",
  apiBaseUrl: (() => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
    const isDevelopment = import.meta.env.MODE === "development";

    if (isLocalhost || isDevelopment) {
      return "http://localhost:3001/api";
    }
    return `${window.location.origin}/niver2025/api`;
  })(),
  spotify: {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri:
      import.meta.env.VITE_SPOTIFY_REDIRECT_URI ||
      `${window.location.origin}/niver2025/callback`,
    scopes: [
      "user-read-private",
      "user-read-email",
      "playlist-modify-public",
      "playlist-modify-private",
    ],
  },
};

export default config;
