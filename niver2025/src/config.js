// Environment configuration
const config = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  apiBaseUrl: (() => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isLocalhost || isDevelopment) {
      return "http://localhost:3001/api";
    }
    return `${window.location.origin}/niver2025/api`;
  })(),
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    redirectUri:
      process.env.SPOTIFY_REDIRECT_URI ||
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
