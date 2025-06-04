import config from "./config.js";

// Helper function to handle API responses
async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Non-JSON response:", {
      status: response.status,
      statusText: response.statusText,
      contentType,
      text: text.substring(0, 200), // Log first 200 chars to avoid huge logs
    });
    throw new Error(`Expected JSON response but got ${contentType}`);
  }
  return response.json();
}

// Helper function to handle authentication
async function handleAuthError(error) {
  if (error.error === "Authentication required" && error.authUrl) {
    // Store the current URL to redirect back after authentication
    sessionStorage.setItem("redirectAfterAuth", window.location.href);
    // Redirect to Spotify auth page
    window.location.href = error.authUrl;
    return { success: false, error: "Authentication required" };
  }
  throw error;
}

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${config.urls.api}${endpoint}`;
    console.log(`API Call: ${options.method || "GET"} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        return handleAuthError(errorData);
      }
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }

    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Spotify API endpoints
export async function searchSpotifyTracks(query, limit = 10) {
  return apiCall(
    `/spotify/search?query=${encodeURIComponent(query)}&limit=${limit}`
  );
}

export async function addTrackToSpotifyPlaylist(trackId) {
  return apiCall("/spotify/playlist/add", {
    method: "POST",
    body: JSON.stringify({ trackId }),
  });
}

// Participants API endpoints
export async function getParticipants() {
  return apiCall("/participants");
}

export async function addParticipant(participant) {
  // Get music suggestions if available
  const musicSuggestions = window.getSuggestedTracks
    ? window.getSuggestedTracks()
    : [];

  return apiCall("/participants", {
    method: "POST",
    body: JSON.stringify({
      ...participant,
      musicSuggestions,
    }),
  });
}

export async function deleteParticipant(id) {
  return apiCall(`/participants/${id}`, {
    method: "DELETE",
  });
}

export async function getParticipantCount() {
  return apiCall("/participants/count");
}

// Notifications API endpoint
export async function sendNotification(userData) {
  return apiCall("/notifications", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Export helper functions for testing/debugging
export const _internals = {
  handleResponse,
  handleAuthError,
  apiCall,
};
