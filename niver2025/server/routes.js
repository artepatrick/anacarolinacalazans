const express = require("express");
const router = express.Router();
const { addTrackToPlaylist } = require("./spotify-playlist");

// ... existing code ...

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

// ... existing code ...

module.exports = router;
