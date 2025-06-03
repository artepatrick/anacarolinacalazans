const { createClient } = require("@supabase/supabase-js");
const { spotifyApi, getAuthUrl } = require("../spotify/config.js");
const spotifyService = require("../spotify/service.js");

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

exports.handler = async function (event, context) {
  // Parse the URL to get the path and query parameters
  const url = new URL(event.rawUrl);
  // Remove /.netlify/functions/api, /api, and /niver2025/api from the path
  const path = url.pathname
    .replace("/.netlify/functions/api", "")
    .replace("/niver2025/api", "")
    .replace("/api", "");
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
        const { query, limit = 10 } = queryParams;
        if (!query) {
          return {
            statusCode: 400,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Query parameter is required" }),
          };
        }

        // Check if we need to refresh the token
        if (spotifyTokens.expiresAt && Date.now() >= spotifyTokens.expiresAt) {
          const data = await spotifyApi.refreshAccessToken();
          spotifyTokens.accessToken = data.body.access_token;
          spotifyTokens.expiresAt = Date.now() + data.body.expires_in * 1000;
          spotifyApi.setAccessToken(spotifyTokens.accessToken);
        }

        // Search for tracks
        const searchResults = await spotifyApi.searchTracks(query, {
          limit: parseInt(limit),
        });

        // Format the response
        const tracks = searchResults.body.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
          album: track.album.name,
          image: track.album.images[0]?.url,
          preview_url: track.preview_url,
        }));

        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ tracks }),
        };

      case "/spotify/playlist/add":
        if (event.httpMethod !== "POST") {
          return {
            statusCode: 405,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Method not allowed" }),
          };
        }

        const { trackId } = JSON.parse(event.body);
        if (!trackId) {
          return {
            statusCode: 400,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Track ID is required" }),
          };
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

      case "/participants":
        if (event.httpMethod === "GET") {
          const { data, error } = await supabase
            .from("presence_confirmations")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) throw error;

          return {
            statusCode: 200,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
          };
        } else if (event.httpMethod === "POST") {
          const participant = JSON.parse(event.body);
          const { data, error } = await supabase
            .from("presence_confirmations")
            .insert([participant])
            .select();

          if (error) throw error;

          return {
            statusCode: 201,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(data[0]),
          };
        }
        break;

      case "/participants/count":
        const { count, error: countError } = await supabase
          .from("presence_confirmations")
          .select("*", { count: "exact", head: true });

        if (countError) throw countError;

        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ count }),
        };

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
};
