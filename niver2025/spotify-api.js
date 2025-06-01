import SpotifyWebApi from "spotify-web-api-node";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, ".env") });

// Determine the redirect URI based on the environment
const getRedirectUri = () => {
  if (process.env.NODE_ENV === "production") {
    return (
      process.env.SPOTIFY_REDIRECT_URI ||
      "https://anacarolinacalazans.com.br/niver2025/callback"
    );
  }
  return (
    process.env.SPOTIFY_REDIRECT_URI ||
    "http://localhost:3000/niver2025/callback"
  );
};

// Create Spotify API instance
export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: getRedirectUri(),
});

// Function to get authorization URL
export const getAuthUrl = () => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
  ];

  // Generate a random state value
  const state = Math.random().toString(36).substring(7);

  // Create the authorization URL manually instead of using createAuthorizeURL
  const params = new URLSearchParams({
    client_id: spotifyApi.getClientId(),
    response_type: "code",
    redirect_uri: spotifyApi.getRedirectURI(),
    state: state,
    scope: scopes.join(" "),
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Function to refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    const { access_token, expires_in } = data.body;

    spotifyApi.setAccessToken(access_token);
    return { access_token, expires_in };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Function to initialize client credentials
export const initializeClientCredentials = async () => {
  try {
    console.log("Initializing client credentials...");
    console.log("Current credentials state:", {
      hasClientId: !!spotifyApi.getClientId(),
      hasClientSecret: !!spotifyApi.getClientSecret(),
      hasAccessToken: !!spotifyApi.getAccessToken(),
      redirectUri: spotifyApi.getRedirectURI(),
    });

    const data = await spotifyApi.clientCredentialsGrant();
    console.log("Received token data:", {
      hasAccessToken: !!data.body.access_token,
      tokenType: data.body.token_type,
      expiresIn: data.body.expires_in,
    });

    spotifyApi.setAccessToken(data.body.access_token);
    console.log("Client credentials initialized successfully");
    return data.body.access_token;
  } catch (error) {
    console.error("Error initializing client credentials:", error);
    console.error("Error details:", {
      message: error.message,
      statusCode: error.statusCode,
      body: error.body,
    });
    throw error;
  }
};

// Initialize client credentials when the module is loaded
console.log("Starting Spotify API initialization...");
initializeClientCredentials()
  .then(() => console.log("Spotify API initialized successfully"))
  .catch((error) => {
    console.error("Failed to initialize Spotify API:", error);
    // Don't exit the process, just log the error
    console.error("Error details:", {
      message: error.message,
      statusCode: error.statusCode,
      body: error.body,
    });
  });
