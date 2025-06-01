import { spotifyApi } from "../spotify-api.js";

export async function handler(event, context) {
  try {
    const { code } = event.queryStringParameters;

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No authorization code received" }),
        headers: {
          Location: "/niver2025?error=no_code",
        },
      };
    }

    console.log("Received authorization code, exchanging for tokens...");

    // Exchange the code for an access token
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Store the tokens (in a real application, you should store these securely)
    // For now, we'll just redirect back to the main page
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    return {
      statusCode: 302,
      headers: {
        Location: "/niver2025?auth=success",
      },
    };
  } catch (error) {
    console.error("Error in Spotify callback:", error);
    return {
      statusCode: 302,
      headers: {
        Location: "/niver2025?error=auth_failed",
      },
    };
  }
}
