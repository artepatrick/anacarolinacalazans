// Music search and suggestions functionality
import { searchSpotifyTracks, addTrackToSpotifyPlaylist } from "./api.js";

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001"
    : window.location.origin;

let suggestedTracks = new Set();

// DOM Elements
const musicSearchInput = document.getElementById("musicSearch");
const searchResults = document.getElementById("searchResults");
const suggestedMusicList = document.getElementById("suggestedMusic");

// Check for authentication return
const urlParams = new URLSearchParams(window.location.search);
const spotifyAuth = urlParams.get("spotify_auth");
if (spotifyAuth === "success") {
  // Get the stored URL and redirect back
  const redirectUrl = sessionStorage.getItem("redirectAfterAuth");
  if (redirectUrl) {
    sessionStorage.removeItem("redirectAfterAuth");
    window.location.href = redirectUrl;
  }
} else if (spotifyAuth === "error") {
  const errorMessage = urlParams.get("message");
  console.error("Spotify authentication failed:", errorMessage);
  // You might want to show an error message to the user
}

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Display search results
function displaySearchResults(response) {
  searchResults.innerHTML = "";
  const tracks = response.tracks || [];

  if (tracks.length === 0) {
    searchResults.style.display = "none";
    return;
  }

  tracks.forEach((track) => {
    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";
    resultItem.innerHTML = `
            <img src="${track.image || ""}" alt="${track.name}">
            <div class="track-info">
                <div class="track-name">${track.name}</div>
                <div class="artist-name">${track.artist}</div>
            </div>
        `;

    resultItem.addEventListener("click", () => addTrackToSuggestions(track));
    searchResults.appendChild(resultItem);
  });

  searchResults.style.display = "block";
}

// Add track to suggestions
function addTrackToSuggestions(track) {
  console.log("Frontend: Adding track to suggestions:", track);
  if (suggestedTracks.has(track.id)) {
    console.log("Frontend: Track already in suggestions, skipping");
    return;
  }

  const trackElement = document.createElement("div");
  trackElement.className = "suggested-music-item";
  trackElement.dataset.trackId = track.id;
  trackElement.innerHTML = `
        <img src="${track.image || ""}" alt="${track.name}">
        <div class="track-info">
            <div class="track-name">${track.name}</div>
            <div class="artist-name">${track.artist}</div>
        </div>
        <div class="track-status"></div>
        <button class="remove-button" title="Remover música">&times;</button>
    `;

  // Add styles for track status
  const style = document.createElement("style");
  style.textContent = `
    .track-status {
      display: flex;
      align-items: center;
      font-size: 0.9em;
      margin-left: 10px;
      min-width: 150px;
    }
    
    .track-status .loading {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .track-status .loading::before {
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid #666;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .track-status .success {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .track-status .success::before {
      content: '✓';
      font-weight: bold;
    }
    
    .track-status .error {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .track-status .error::before {
      content: '✗';
      font-weight: bold;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);

  // Add remove functionality
  const removeButton = trackElement.querySelector(".remove-button");
  removeButton.addEventListener("click", () => {
    suggestedTracks.delete(track.id);
    trackElement.remove();
  });

  suggestedMusicList.appendChild(trackElement);
  suggestedTracks.add(track.id);

  // Store complete track data
  trackElement.dataset.trackData = JSON.stringify({
    song_title: track.name,
    artist: track.artist,
    spotify_url: track.preview_url || null,
  });

  // Add track to Spotify playlist with loading state
  const statusElement = trackElement.querySelector(".track-status");
  statusElement.innerHTML =
    '<span class="loading">Adicionando à playlist...</span>';
  statusElement.style.color = "#666";

  console.log("Frontend: Calling addTrackToPlaylist with ID:", track.id);
  addTrackToSpotifyPlaylist(track.id).then(({ success, error }) => {
    if (success) {
      statusElement.innerHTML =
        '<span class="success">Adicionado à playlist</span>';
      statusElement.style.color = "#4CAF50";
      // Remove success message after 3 seconds
      setTimeout(() => {
        statusElement.innerHTML = "";
      }, 3000);
    } else {
      statusElement.innerHTML = `<span class="error">Erro: ${error}</span>`;
      statusElement.style.color = "#f44336";
      // Remove error message after 5 seconds
      setTimeout(() => {
        statusElement.innerHTML = "";
      }, 5000);
    }
  });

  musicSearchInput.value = "";
  searchResults.style.display = "none";
}

// Handle search input
const handleSearch = debounce(async (event) => {
  const query = event.target.value.trim();
  if (query.length < 2) {
    searchResults.style.display = "none";
    return;
  }

  const tracks = await searchSpotifyTracks(query);
  displaySearchResults(tracks);
}, 300);

// Event Listeners
musicSearchInput.addEventListener("input", handleSearch);

// Close search results when clicking outside
document.addEventListener("click", (event) => {
  if (
    !musicSearchInput.contains(event.target) &&
    !searchResults.contains(event.target)
  ) {
    searchResults.style.display = "none";
  }
});

// Get suggested tracks for form submission
export function getSuggestedTracks() {
  const tracks = [];
  const trackElements = document.querySelectorAll(".suggested-music-item");
  trackElements.forEach((element) => {
    const trackData = JSON.parse(element.dataset.trackData);
    tracks.push(trackData);
  });
  return tracks;
}

// Make getSuggestedTracks available globally
window.getSuggestedTracks = getSuggestedTracks;
