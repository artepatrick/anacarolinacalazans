import { spotifyApi } from "./spotify-api.js";

let accessToken = null;
let tokenExpirationTime = null;

// Function to get a valid access token
async function getValidAccessToken() {
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  try {
    const data = await spotifyApi.clientCredentialsGrant();
    accessToken = data.body["access_token"];
    tokenExpirationTime = Date.now() + data.body["expires_in"] * 1000;
    spotifyApi.setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
}

// Search for tracks
export async function searchTracks(query, limit = 10) {
  try {
    console.log("Starting track search with query:", query);
    console.log("Current Spotify API state:", {
      hasAccessToken: !!spotifyApi.getAccessToken(),
      hasClientId: !!spotifyApi.getClientId(),
      hasClientSecret: !!spotifyApi.getClientSecret(),
    });

    await getValidAccessToken();
    console.log("Got valid access token, proceeding with search");

    const response = await spotifyApi.searchTracks(query, { limit });
    console.log("Search response received:", {
      status: response.statusCode,
      hasTracks: !!response.body?.tracks,
      trackCount: response.body?.tracks?.items?.length || 0,
    });

    return response.body.tracks.items;
  } catch (error) {
    console.error("Error searching tracks:", error);
    throw error;
  }
}

// Get track details
export async function getTrack(trackId) {
  try {
    await getValidAccessToken();
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
    await getValidAccessToken();
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
    await getValidAccessToken();
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
    await getValidAccessToken();
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
    await getValidAccessToken();
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
    await getValidAccessToken();
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
    await getValidAccessToken();
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
