// Supabase configuration
let config = {
  SUPABASE_URL: null,
  SUPABASE_ANON_KEY: null,
};

// Fetch configuration from server
async function initializeConfig() {
  try {
    const response = await fetch("/api/config");
    const data = await response.json();
    config = data;
  } catch (error) {
    console.error("Error fetching configuration:", error);
  }
}

// Initialize config immediately
initializeConfig();

export { config, initializeConfig };
