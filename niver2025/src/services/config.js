// Configuração do frontend
import config from "../../config/index.js";

// Configuração específica do frontend
const frontendConfig = {
  ...config,
  // Sobrescreve URLs para usar window.location em ambiente de browser
  urls: {
    ...config.urls,
    base: window.location.origin + "/niver2025",
    api:
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? "http://localhost:3001/api"
        : window.location.origin + "/niver2025/api",
    callback:
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000/niver2025/callback"
        : window.location.origin + "/niver2025/callback",
  },
};

export default frontendConfig;
