// Music search and suggestions functionality
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : window.location.origin;

let suggestedTracks = new Set();

// DOM Elements
const musicSearchInput = document.getElementById("musicSearch");
const searchResults = document.getElementById("searchResults");
const suggestedMusicList = document.getElementById("suggestedMusic");

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

// Search tracks on Spotify
async function searchTracks(query) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/spotify/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Failed to search tracks");
    return await response.json();
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
}

// Display search results
function displaySearchResults(tracks) {
  searchResults.innerHTML = "";
  if (tracks.length === 0) {
    searchResults.style.display = "none";
    return;
  }

  tracks.forEach((track) => {
    const resultItem = document.createElement("div");
    resultItem.className = "search-result-item";
    resultItem.innerHTML = `
            <img src="${track.album.images[2]?.url || ""}" alt="${track.name}">
            <div class="track-info">
                <div class="track-name">${track.name}</div>
                <div class="artist-name">${track.artists
                  .map((artist) => artist.name)
                  .join(", ")}</div>
            </div>
        `;

    resultItem.addEventListener("click", () => addTrackToSuggestions(track));
    searchResults.appendChild(resultItem);
  });

  searchResults.style.display = "block";
}

// Add track to suggestions
function addTrackToSuggestions(track) {
  if (suggestedTracks.has(track.id)) return;

  const trackElement = document.createElement("div");
  trackElement.className = "suggested-music-item";
  trackElement.dataset.trackId = track.id;
  trackElement.innerHTML = `
        <img src="${track.album.images[2]?.url || ""}" alt="${track.name}">
        <div class="track-info">
            <div class="track-name">${track.name}</div>
            <div class="artist-name">${track.artists
              .map((artist) => artist.name)
              .join(", ")}</div>
        </div>
        <button class="remove-button" title="Remover música">&times;</button>
    `;

  // Add remove functionality
  const removeButton = trackElement.querySelector(".remove-button");
  removeButton.addEventListener("click", () => {
    suggestedTracks.delete(track.id);
    trackElement.remove();
  });

  suggestedMusicList.appendChild(trackElement);
  suggestedTracks.add(track.id);
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

  const tracks = await searchTracks(query);
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
  return Array.from(suggestedTracks);
}
