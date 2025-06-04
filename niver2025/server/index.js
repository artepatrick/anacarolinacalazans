import { config } from "dotenv";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";
import * as spotifyService from "../spotify-service.js";
import { spotifyApi, getAuthUrl } from "../spotify-api.js";
import SupabasePhoneMaintenance from "../UTILS/supabasePhoneMaintenance.js";
import routes from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
config({ path: join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3001;

// Debug: Check if environment variables are loaded
console.log("Environment variables check:", {
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
  supabaseUrlLength: process.env.SUPABASE_URL?.length,
  supabaseKeyLength: process.env.SUPABASE_SERVICE_KEY?.length,
  // Add Spotify credentials check
  hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID,
  hasSpotifyClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
  hasSpotifyRedirectUri: !!process.env.SPOTIFY_REDIRECT_URI,
  hasSpotifyPlaylistId: !!process.env.SPOTIFY_PLAYLIST_ID,
  spotifyClientIdLength: process.env.SPOTIFY_CLIENT_ID?.length,
  spotifyClientSecretLength: process.env.SPOTIFY_CLIENT_SECRET?.length,
  spotifyRedirectUriLength: process.env.SPOTIFY_REDIRECT_URI?.length,
  spotifyPlaylistIdLength: process.env.SPOTIFY_PLAYLIST_ID?.length,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "https://jpkqterigrjwpyrwmxfj.supabase.co",
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize phone maintenance
const phoneMaintenance = new SupabasePhoneMaintenance(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware
app.use(
  cors({
    origin: [
      "https://anacarolinacalazans.com.br",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:5173", // Vite default port
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "DELETE", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON bodies
app.use(express.json());

// Register routes
app.use("/niver2025/api", routes);

// Store tokens in memory (in production, you should use a database)
let spotifyTokens = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

// API Routes - These must come BEFORE the static file serving
// Spotify authentication route
app.get("/api/spotify/auth", async (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).json({ error: "Failed to generate auth URL" });
  }
});

// Spotify callback route
app.get("/niver2025/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      throw new Error("No code provided");
    }

    // Exchange the code for an access token
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    // Store tokens
    spotifyTokens = {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000,
    };

    // Set the tokens in the API instance
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    // Redirect back to the main page with success
    res.redirect("/niver2025/?spotify_auth=success");
  } catch (error) {
    console.error("Spotify Callback Error:", error);
    // Redirect back to the main page with error
    res.redirect(
      "/niver2025/?spotify_auth=error&message=" +
        encodeURIComponent(error.message)
    );
  }
});

// Get participants
app.get("/niver2025/api/participants", async (req, res) => {
  try {
    console.log("Fetching participants from Supabase...");

    const { data, error } = await supabase
      .from("presence_confirmations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log(`Successfully fetched ${data.length} participants`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Add new participant
app.post("/niver2025/api/participants", async (req, res) => {
  try {
    const {
      names,
      email,
      phone,
      status,
      created_at,
      updated_at,
      musicSuggestions,
    } = req.body;

    // Log the received data for debugging
    console.log("Received participant data:", req.body);

    // Validate and format phone number
    const phoneValidation = phoneMaintenance.validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      return res.status(400).json({
        error: "Invalid phone number",
        details: phoneValidation.error,
      });
    }

    // Start a transaction
    const { data: participant, error: participantError } = await supabase
      .from("presence_confirmations")
      .insert([
        {
          names,
          email,
          phone: phoneValidation.formattedNumber,
          status: status || "pendente",
          created_at: created_at || new Date().toISOString(),
          updated_at: updated_at || new Date().toISOString(),
        },
      ])
      .select();

    if (participantError) {
      console.error("Supabase error:", participantError);
      throw participantError;
    }

    // If there are music suggestions, save them
    if (musicSuggestions && musicSuggestions.length > 0) {
      const musicSuggestionsData = musicSuggestions.map((suggestion) => ({
        presence_confirmation_id: participant[0].id,
        song_title: suggestion.song_title,
        artist: suggestion.artist,
        spotify_url: suggestion.spotify_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { error: musicError } = await supabase
        .from("music_suggestions")
        .insert(musicSuggestionsData);

      if (musicError) {
        console.error("Error saving music suggestions:", musicError);
        throw musicError;
      }
    }

    res.status(201).json(participant[0]);
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Add new endpoint to update all phone numbers
app.post("/api/maintenance/update-phones", async (req, res) => {
  try {
    const result = await phoneMaintenance.updateAllPhoneNumbers();
    res.json(result);
  } catch (error) {
    console.error("Error updating phone numbers:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Add new endpoint to find invalid phone numbers
app.get("/api/maintenance/invalid-phones", async (req, res) => {
  try {
    const invalidPhones = await phoneMaintenance.findInvalidPhoneNumbers();
    res.json(invalidPhones);
  } catch (error) {
    console.error("Error finding invalid phone numbers:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Delete participant
app.delete("/api/participants/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("presence_confirmations")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Participant deleted successfully" });
  } catch (error) {
    console.error("Error deleting participant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get participant count
app.get("/api/participants/count", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("presence_confirmations")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ count });
  } catch (error) {
    console.error("Error getting participant count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send notification
app.post("/api/notifications", async (req, res) => {
  try {
    console.log("Received notification request:", req.body);

    const userData = req.body;
    const standard =
      "Estamos enviando uma confirmação de presença para um aniversário. Por favor, envie uma mensagem amigável confirmando a presença e agradecendo o interesse.";

    const requestBody = {
      data: [
        {
          userName: userData.names[0],
          email: userData.email,
          phone: userData.phone,
          eventType: "birthday",
          eventDate: "2025-06-28",
        },
      ],
      generalInstructions: userData.generalInstructions || standard,
    };

    console.log("Sending request to Tolky:", {
      url: process.env.TOLKY_API_BASE_URL,
      hasToken: !!process.env.TOLKY_REASONING_TOKEN,
    });

    const response = await fetch(
      `${process.env.TOLKY_API_BASE_URL}/api/externalAPIs/public/externalNotificationAI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOLKY_REASONING_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tolky API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Tolky API error: ${errorText}`);
    }

    const result = await response.json();
    console.log("Tolky API success response:", result);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      error: "Failed to send notification",
      details: error.message,
    });
  }
});

// Spotify search endpoint
app.get("/api/spotify/search", async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
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

    res.json({ tracks });
  } catch (error) {
    console.error("Error searching Spotify tracks:", error);
    if (error.statusCode === 401) {
      res.status(401).json({
        error: "Authentication required",
        authUrl: getAuthUrl(),
      });
    } else {
      res.status(500).json({ error: "Failed to search tracks" });
    }
  }
});

// Get track details
app.get("/api/spotify/tracks/:id", async (req, res) => {
  try {
    const track = await spotifyService.getTrack(req.params.id);
    res.json(track);
  } catch (error) {
    console.error("Error getting track:", error);
    res.status(500).json({ error: "Failed to get track" });
  }
});

// Get artist details
app.get("/api/spotify/artists/:id", async (req, res) => {
  try {
    const artist = await spotifyService.getArtist(req.params.id);
    res.json(artist);
  } catch (error) {
    console.error("Error getting artist:", error);
    res.status(500).json({ error: "Failed to get artist" });
  }
});

// Get artist's top tracks
app.get("/api/spotify/artists/:id/top-tracks", async (req, res) => {
  try {
    const { country } = req.query;
    const tracks = await spotifyService.getArtistTopTracks(
      req.params.id,
      country || "BR"
    );
    res.json(tracks);
  } catch (error) {
    console.error("Error getting artist top tracks:", error);
    res.status(500).json({ error: "Failed to get artist top tracks" });
  }
});

// Get artist's albums
app.get("/api/spotify/artists/:id/albums", async (req, res) => {
  try {
    const { limit } = req.query;
    const albums = await spotifyService.getArtistAlbums(
      req.params.id,
      parseInt(limit) || 10
    );
    res.json(albums);
  } catch (error) {
    console.error("Error getting artist albums:", error);
    res.status(500).json({ error: "Failed to get artist albums" });
  }
});

// Get album details
app.get("/api/spotify/albums/:id", async (req, res) => {
  try {
    const album = await spotifyService.getAlbum(req.params.id);
    res.json(album);
  } catch (error) {
    console.error("Error getting album:", error);
    res.status(500).json({ error: "Failed to get album" });
  }
});

// Get album tracks
app.get("/api/spotify/albums/:id/tracks", async (req, res) => {
  try {
    const { limit } = req.query;
    const tracks = await spotifyService.getAlbumTracks(
      req.params.id,
      parseInt(limit) || 50
    );
    res.json(tracks);
  } catch (error) {
    console.error("Error getting album tracks:", error);
    res.status(500).json({ error: "Failed to get album tracks" });
  }
});

// Get recommendations
app.get("/api/spotify/recommendations", async (req, res) => {
  try {
    const { seed_tracks, limit } = req.query;
    if (!seed_tracks) {
      return res
        .status(400)
        .json({ error: "seed_tracks parameter is required" });
    }
    const tracks = await spotifyService.getRecommendations(
      seed_tracks.split(","),
      parseInt(limit) || 20
    );
    res.json(tracks);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// Add track to playlist
app.post("/api/spotify/playlist/add", async (req, res) => {
  console.log("Received request to add track to playlist:", req.body);
  try {
    const { trackId } = req.body;
    if (!trackId) {
      console.log("Error: Track ID is missing from request");
      return res.status(400).json({ error: "Track ID is required" });
    }

    // Check if we have valid tokens
    if (!spotifyTokens.accessToken || Date.now() >= spotifyTokens.expiresAt) {
      console.log("Token expired or missing, attempting to refresh...");
      if (spotifyTokens.refreshToken) {
        try {
          // Try to refresh the token
          console.log("Refreshing token...");
          const data = await spotifyApi.refreshAccessToken();
          spotifyTokens = {
            ...spotifyTokens,
            accessToken: data.body.access_token,
            expiresAt: Date.now() + data.body.expires_in * 1000,
          };
          spotifyApi.setAccessToken(data.body.access_token);
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Error refreshing token:", error);
          return res.status(401).json({
            error: "Authentication required",
            authUrl: getAuthUrl(),
          });
        }
      } else {
        console.log("No refresh token available, redirecting to auth...");
        return res.status(401).json({
          error: "Authentication required",
          authUrl: getAuthUrl(),
        });
      }
    }

    console.log(`Processing request to add track ${trackId} to playlist`);
    const result = await spotifyService.addTrackToPlaylist(trackId);
    console.log("Successfully processed request:", result);
    res.json(result);
  } catch (error) {
    console.error("Error in playlist add route:", error);
    if (error.message.includes("Authentication required")) {
      return res.status(401).json({
        error: "Authentication required",
        authUrl: getAuthUrl(),
      });
    }
    res
      .status(500)
      .json({ error: error.message || "Failed to add track to playlist" });
  }
});

// Serve static files AFTER API routes
app.use(express.static(join(__dirname, "..")));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
