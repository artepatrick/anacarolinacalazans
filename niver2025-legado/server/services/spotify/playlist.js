import { spotifyApi } from "./spotify-api.js";
import config from "../../../config/index.js";

export async function addTrackToPlaylist(trackId) {
  try {
    if (!trackId) {
      throw new Error("Track ID is required");
    }

    const playlistId = config.spotify.playlistId;
    if (!playlistId) {
      throw new Error("Playlist ID is not configured");
    }

    const result = await spotifyApi.addTracksToPlaylist(playlistId, [
      `spotify:track:${trackId}`,
    ]);
    return result.body;
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    throw error;
  }
}
