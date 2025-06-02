import { createClient } from "@supabase/supabase-js";
import { spotifyApi, getAuthUrl } from "../spotify/config.js";
import * as spotifyService from "../spotify/service.js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Store tokens in memory (in production, you should use a database)
let spotifyTokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

export async function handler(event, context) {
  // Parse the URL to get the path and query parameters
  const url = new URL(event.rawUrl);
  const path = url.pathname.replace("/.netlify/functions/api", "");
  const queryParams = Object.fromEntries(url.searchParams);

  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
    // Handle different API routes
    switch (path) {
      case "/spotify/search":
        const tracks = await spotifyService.searchTracks(
          queryParams.query,
          parseInt(queryParams.limit) || 10
        );
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(tracks),
        };

      case "/spotify/playlist/add":
        if (event.httpMethod !== "POST") {
          throw new Error("Method not allowed");
        }

        const { trackId } = JSON.parse(event.body);
        if (!trackId) {
          throw new Error("Track ID is required");
        }

        // Check if we have valid tokens
        if (
          !spotifyTokens.accessToken ||
          Date.now() >= spotifyTokens.expiresAt
        ) {
          if (spotifyTokens.refreshToken) {
            try {
              const data = await spotifyApi.refreshAccessToken();
              spotifyTokens = {
                ...spotifyTokens,
                accessToken: data.body.access_token,
                expiresAt: Date.now() + data.body.expires_in * 1000,
              };
              spotifyApi.setAccessToken(data.body.access_token);
            } catch (error) {
              return {
                statusCode: 401,
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({
                  error: "Authentication required",
                  authUrl: getAuthUrl(),
                }),
              };
            }
          } else {
            return {
              statusCode: 401,
              headers: { ...headers, "Content-Type": "application/json" },
              body: JSON.stringify({
                error: "Authentication required",
                authUrl: getAuthUrl(),
              }),
            };
          }
        }

        const result = await spotifyService.addTrackToPlaylist(trackId);
        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify(result),
        };

      // Add other API routes here...

      default:
        return {
          statusCode: 404,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Not found" }),
        };
    }
  } catch (error) {
    console.error("API Error:", error);
    return {
      statusCode: error.statusCode || 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error.message || "Internal server error",
      }),
    };
  }
}
