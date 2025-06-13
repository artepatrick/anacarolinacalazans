const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// ID da playlist onde as músicas serão adicionadas
const PLAYLIST_ID = "3IXvRrv8DcsH2ggcXnpnLy"; // Playlist do aniversário da Carol

// Função para obter um token de acesso válido
async function getValidAccessToken() {
  try {
    console.log("Getting new access token...");
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Successfully obtained new access token");
    return data.body["access_token"];
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

// Função para adicionar uma música à playlist
async function addTrackToPlaylist(trackId) {
  try {
    console.log(
      `Attempting to add track ${trackId} to playlist ${PLAYLIST_ID}`
    );
    await getValidAccessToken();

    const trackUri = `spotify:track:${trackId}`;
    console.log(`Adding track URI: ${trackUri}`);

    const response = await spotifyApi.addTracksToPlaylist(PLAYLIST_ID, [
      trackUri,
    ]);
    console.log("Successfully added track to playlist:", response.body);
    return response.body;
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    throw error;
  }
}

module.exports = {
  addTrackToPlaylist,
};
