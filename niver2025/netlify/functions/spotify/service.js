const { spotifyApi } = require("./config");

async function addTrackToPlaylist(trackId) {
  try {
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;

    // Add the track to the playlist
    await spotifyApi.addTracksToPlaylist(playlistId, [
      `spotify:track:${trackId}`,
    ]);

    return {
      success: true,
      message: "Track added to playlist successfully",
    };
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to add track to playlist",
    };
  }
}

module.exports = {
  addTrackToPlaylist,
};

export async function refreshAccessToken() {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}
