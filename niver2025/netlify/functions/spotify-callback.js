import { spotifyApi } from "../spotify/config.js";

export async function handler(event, context) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Parse the URL to get the code
    const url = new URL(event.rawUrl);
    const code = url.searchParams.get("code");

    if (!code) {
      throw new Error("No code provided");
    }

    // Exchange the code for an access token
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Store tokens (in production, you should store these in a database)
    // For now, we'll just return them to the client
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      }),
    };
  } catch (error) {
    console.error("Spotify Callback Error:", error);
    return {
      statusCode: error.statusCode || 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error.message || "Internal server error",
      }),
    };
  }
}
