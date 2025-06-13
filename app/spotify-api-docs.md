# Spotify API Service Documentation

## Overview
This service provides a wrapper around the Spotify Web API using the `spotify-web-api-node` library. It implements various endpoints for searching and retrieving music-related data from Spotify.

## Configuration

### Environment Variables
The service requires the following environment variables to be set:
```env
SPOTIFY_CLIENT_ID=82045225ac554ca5a10aa806b6ab0515
SPOTIFY_CLIENT_SECRET=f336d02deed4469586576ae2fb3944fa
SPOTIFY_REDIRECT_URI=your_redirect_uri
```

### Redirect URI Configuration
The `SPOTIFY_REDIRECT_URI` is a crucial security feature in the Spotify authentication flow. It specifies where Spotify should redirect users after they authenticate your application.

#### Development Setup
For local development, use:
```env
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

#### Production Setup
For production, use your actual domain:
```env
SPOTIFY_REDIRECT_URI=https://your-domain.com/callback
```

#### Important Notes:
1. The redirect URI must be registered in your Spotify Developer Dashboard
2. You can register multiple redirect URIs for different environments
3. The URI must match exactly (including protocol, domain, and path)
4. For production, always use HTTPS

#### Setting up in Spotify Developer Dashboard:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your application
3. Click "Edit Settings"
4. Under "Redirect URIs", add both your development and production URIs:
   - `http://localhost:3000/callback`
   - `https://your-domain.com/callback`

#### Handling Multiple Environments
To handle different environments, you can use environment-specific configuration:

```javascript
const redirectUri = process.env.NODE_ENV === 'production'
  ? 'https://your-domain.com/callback'
  : 'http://localhost:3000/callback';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: redirectUri,
});
```

## Authentication
The service uses the Client Credentials Flow for authentication, which is automatically handled by the `getValidAccessToken()` function. This function:
- Checks if there's a valid existing token
- If not, requests a new token
- Manages token expiration
- Automatically refreshes when needed

## Available Endpoints

### 1. Search Tracks
```javascript
searchTracks(query: string, limit?: number): Promise<Track[]>
```
Searches for tracks based on a query string.
- `query`: Search term
- `limit`: Maximum number of results (default: 10)

### 2. Get Track Details
```javascript
getTrack(trackId: string): Promise<Track>
```
Retrieves detailed information about a specific track.
- `trackId`: Spotify track ID

### 3. Get Artist Details
```javascript
getArtist(artistId: string): Promise<Artist>
```
Retrieves detailed information about an artist.
- `artistId`: Spotify artist ID

### 4. Get Artist's Top Tracks
```javascript
getArtistTopTracks(artistId: string, country?: string): Promise<Track[]>
```
Retrieves an artist's top tracks for a specific country.
- `artistId`: Spotify artist ID
- `country`: Country code (default: "BR")

### 5. Get Artist's Albums
```javascript
getArtistAlbums(artistId: string, limit?: number): Promise<Album[]>
```
Retrieves albums by a specific artist.
- `artistId`: Spotify artist ID
- `limit`: Maximum number of results (default: 10)

### 6. Get Album Details
```javascript
getAlbum(albumId: string): Promise<Album>
```
Retrieves detailed information about an album.
- `albumId`: Spotify album ID

### 7. Get Album Tracks
```javascript
getAlbumTracks(albumId: string, limit?: number): Promise<Track[]>
```
Retrieves all tracks from a specific album.
- `albumId`: Spotify album ID
- `limit`: Maximum number of results (default: 50)

### 8. Get Recommendations
```javascript
getRecommendations(seedTracks: string[], limit?: number): Promise<Track[]>
```
Gets track recommendations based on seed tracks.
- `seedTracks`: Array of Spotify track IDs to base recommendations on
- `limit`: Maximum number of recommendations (default: 20)

## Error Handling
All endpoints include error handling and will throw errors with appropriate messages if the API request fails. Errors are logged to the console with the specific error message.

## Usage Example

```javascript
import { searchTracks, getArtistTopTracks } from './spotify-service';

// Search for tracks
const tracks = await searchTracks('Bohemian Rhapsody');

// Get artist's top tracks
const artistTopTracks = await getArtistTopTracks('artist_id_here');
```

## Response Types

### Track Object
```typescript
interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  // ... other track properties
}
```

### Artist Object
```typescript
interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: Image[];
  popularity: number;
  // ... other artist properties
}
```

### Album Object
```typescript
interface Album {
  id: string;
  name: string;
  artists: Artist[];
  images: Image[];
  release_date: string;
  total_tracks: number;
  // ... other album properties
}
```

## Best Practices
1. Always handle errors using try/catch blocks
2. Use appropriate limits to avoid rate limiting
3. Cache responses when possible to reduce API calls
4. Monitor token expiration and refresh when needed

## Rate Limiting
The Spotify API has rate limits that should be considered:
- 25 requests per second for authenticated requests
- 10 requests per second for unauthenticated requests

## Additional Resources
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [spotify-web-api-node GitHub Repository](https://github.com/thelinmichael/spotify-web-api-node) 