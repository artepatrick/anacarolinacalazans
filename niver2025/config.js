// Environment configuration
const config = {
  isDevelopment:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1",
  isProduction:
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1",
  apiBaseUrl: (() => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    if (isLocalhost) {
      return "http://localhost:3001/api";
    }
    return `${window.location.origin}/niver2025/api`;
  })(),
  supabase: {
    url: "",
    anonKey: "",
  },
  spotify: {
    clientId: "",
    redirectUri:
      "" ||
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
