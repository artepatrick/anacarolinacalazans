import { spotifyApi, initializeClientCredentials } from "./config.js";

// Search for tracks
export async function searchTracks(query, limit = 10) {
  try {
    console.log("Starting track search with query:", query);
    console.log("Current Spotify API state:", {
      hasAccessToken: !!spotifyApi.getAccessToken(),
      hasClientId: !!spotifyApi.getClientId(),
      hasClientSecret: !!spotifyApi.getClientSecret(),
      redirectUri: spotifyApi.getRedirectURI(),
    });

    // Check if we have a valid access token
    if (!spotifyApi.getAccessToken()) {
      console.log(
        "No access token available, initializing client credentials..."
      );
      const token = await initializeClientCredentials();
      console.log("New token obtained:", {
        hasToken: !!token,
        tokenLength: token?.length,
      });
    }

    console.log("Making search request to Spotify API...");
    const response = await spotifyApi.searchTracks(query, { limit });
    console.log("Search response received:", {
      status: response.statusCode,
      hasTracks: !!response.body?.tracks,
      trackCount: response.body?.tracks?.items?.length || 0,
      headers: response.headers,
    });

    return response.body.tracks.items;
  } catch (error) {
    console.error("Error searching tracks:", error);
    console.error("Error details:", {
      message: error.message,
      statusCode: error.statusCode,
      body: error.body,
    });
    if (
      error.body?.error?.status === 401 ||
      error.message === "Authentication required"
    ) {
      throw new Error("Authentication required");
    }
    throw error;
  }
}

// Get track details
export async function getTrack(trackId) {
  try {
    const response = await spotifyApi.getTrack(trackId);
    return response.body;
  } catch (error) {
    console.error("Error getting track:", error);
    throw error;
  }
}

// Get artist details
export async function getArtist(artistId) {
  try {
    const response = await spotifyApi.getArtist(artistId);
    return response.body;
  } catch (error) {
    console.error("Error getting artist:", error);
    throw error;
  }
}

// Get artist's top tracks
export async function getArtistTopTracks(artistId, country = "BR") {
  try {
    const response = await spotifyApi.getArtistTopTracks(artistId, country);
    return response.body.tracks;
  } catch (error) {
    console.error("Error getting artist top tracks:", error);
    throw error;
  }
}

// Get artist's albums
export async function getArtistAlbums(artistId, limit = 10) {
  try {
    const response = await spotifyApi.getArtistAlbums(artistId, { limit });
    return response.body.items;
  } catch (error) {
    console.error("Error getting artist albums:", error);
    throw error;
  }
}

// Get album details
export async function getAlbum(albumId) {
  try {
    const response = await spotifyApi.getAlbum(albumId);
    return response.body;
  } catch (error) {
    console.error("Error getting album:", error);
    throw error;
  }
}

// Get album tracks
export async function getAlbumTracks(albumId, limit = 50) {
  try {
    const response = await spotifyApi.getAlbumTracks(albumId, { limit });
    return response.body.items;
  } catch (error) {
    console.error("Error getting album tracks:", error);
    throw error;
  }
}

// Get recommendations based on seed tracks
export async function getRecommendations(seedTracks, limit = 20) {
  try {
    const response = await spotifyApi.getRecommendations({
      seed_tracks: seedTracks,
      limit,
    });
    return response.body.tracks;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw error;
  }
}

// Add track to playlist
export async function addTrackToPlaylist(trackId) {
  try {
    console.log(`Attempting to add track ${trackId} to playlist`);

    if (!spotifyApi.getAccessToken()) {
      throw new Error("Authentication required");
    }

    const trackUri = `spotify:track:${trackId}`;
    console.log(`Adding track URI: ${trackUri}`);

    const response = await spotifyApi.addTracksToPlaylist(
      "3IXvRrv8DcsH2ggcXnpnLy",
      [trackUri]
    );
    console.log("Successfully added track to playlist:", response.body);
    return response.body;
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    if (
      error.body?.error?.status === 401 ||
      error.message === "Authentication required"
    ) {
      throw new Error("Authentication required");
    }
    throw error;
  }
}
