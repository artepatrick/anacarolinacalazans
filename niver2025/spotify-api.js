import SpotifyWebApi from "spotify-web-api-node";

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

  return spotifyApi.createAuthorizeURL(scopes, "state");
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
