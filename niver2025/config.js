// API and service configurations
export const config = {
  // Supabase configuration
  SUPABASE_URL: "undefined",
  SUPABASE_ANON_KEY: "undefined",

  // API configuration
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://anacarolinacalazans.com.br/niver2025/api"
      : "http://localhost:3001/api",
};
