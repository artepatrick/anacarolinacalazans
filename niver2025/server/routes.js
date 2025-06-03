import express from "express";
import { addTrackToPlaylist } from "./spotify-playlist.js";
import { spotifyApi } from "../spotify-api.js";

const router = express.Router();

// Spotify search endpoint
router.get("/spotify/search", async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const searchResults = await spotifyApi.searchTracks(query, {
      limit: parseInt(limit),
    });
    res.json(searchResults.body.tracks.items);
  } catch (error) {
    console.error("Error searching Spotify tracks:", error);
    if (error.statusCode === 401) {
      res.status(401).json({
        error: "Authentication required",
        authUrl: "/api/spotify/auth",
      });
    } else {
      res.status(500).json({ error: "Failed to search tracks" });
    }
  }
});

// Rota para adicionar música à playlist
router.post("/spotify/playlist/add", async (req, res) => {
  console.log("Received request to add track to playlist:", req.body);
  try {
    const { trackId } = req.body;
    if (!trackId) {
      console.log("Error: Track ID is missing from request");
      return res.status(400).json({ error: "Track ID is required" });
    }

    console.log(`Processing request to add track ${trackId} to playlist`);
    const result = await addTrackToPlaylist(trackId);
    console.log("Successfully processed request:", result);
    res.json(result);
  } catch (error) {
    console.error("Error in playlist add route:", error);
    res.status(500).json({ error: "Failed to add track to playlist" });
  }
});

export default router;
