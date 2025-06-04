import config from "./config";

// API service for frontend-backend communication
const API_BASE_URL = config.apiBaseUrl;

console.log("API Service initialized with base URL:", API_BASE_URL);

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

// Spotify API endpoints
export async function searchSpotifyTracks(query, limit = 10) {
  try {
    const url = `${API_BASE_URL}/spotify/search?query=${encodeURIComponent(
      query
    )}&limit=${limit}`;
    console.log("Searching Spotify tracks:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        return handleAuthError(errorData);
      }
      throw new Error(
        `Failed to search tracks: ${errorData.error || response.statusText}`
      );
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Error searching Spotify tracks:", error);
    throw error;
  }
}

export async function addTrackToSpotifyPlaylist(trackId) {
  try {
    const url = `${API_BASE_URL}/spotify/playlist/add`;
    console.log("Adding track to Spotify playlist:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trackId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        return handleAuthError(errorData);
      }
      throw new Error(
        `Failed to add track to playlist: ${
          errorData.error || response.statusText
        }`
      );
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Error adding track to Spotify playlist:", error);
    throw error;
  }
}

// Get all participants
export async function getParticipants() {
  try {
    const url = `${API_BASE_URL}/participants`;
    console.log("Fetching participants from:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch participants: ${errorText}`);
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
}

// Add new participant
export async function addParticipant(participant) {
  try {
    const url = `${API_BASE_URL}/participants`;
    console.log("Adding participant to:", url);

    // Get music suggestions if available
    const musicSuggestions = window.getSuggestedTracks
      ? window.getSuggestedTracks()
      : [];
    const participantData = {
      ...participant,
      musicSuggestions,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(participantData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add participant: ${errorText}`);
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Error adding participant:", error);
    throw error;
  }
}

// Delete participant
export async function deleteParticipant(id) {
  try {
    const url = `${API_BASE_URL}/participants/${id}`;
    console.log("Deleting participant from:", url);

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete participant: ${errorText}`);
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Error deleting participant:", error);
    throw error;
  }
}

// Get participant count
export async function getParticipantCount() {
  try {
    const url = `${API_BASE_URL}/participants/count`;
    console.log("Getting participant count from:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get participant count: ${errorText}`);
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Error getting participant count:", error);
    throw error;
  }
}

// Send notification through backend
export async function sendNotification(userData) {
  try {
    const url = `${API_BASE_URL}/notifications`;
    console.log("Sending notification through:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send notification: ${errorText}`);
    }

    return await handleResponse(response);
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
