// API Configuration
const API_BASE_URL = "/niver2025/api";
const WS_BASE_URL = "ws://localhost:5050/ws";

// WebSocket Configuration
let ws = null;
let sessionId = localStorage.getItem("wsSessionId");
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;

// Countdown Configuration
const EVENT_DATE = new Date("2025-01-01T00:00:00").getTime();

// Form Elements
const confirmationForm = document.getElementById("confirmationForm");
const namesContainer = document.getElementById("namesContainer");
const addNameButton = document.getElementById("addNameButton");
const submitButton = document.getElementById("submitButton");

// Countdown Elements
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

// WebSocket Connection Management
const setupWebSocket = () => {
  ws = new WebSocket(`${WS_BASE_URL}/participants`);

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    reconnectAttempts = 0;

    if (sessionId) {
      // Attempt to restore previous session
      ws.send(
        JSON.stringify({
          type: "session_restore",
          sessionId: sessionId,
        })
      );
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "session":
        // Store new session ID
        sessionId = data.sessionId;
        localStorage.setItem("wsSessionId", sessionId);
        break;

      case "session_restored":
        console.log("Session restored successfully");
        break;

      case "participant_update":
        // Handle real-time participant updates
        handleParticipantUpdate(data.content);
        break;

      case "error":
        console.error("WebSocket error:", data.content);
        break;
    }
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
    handleReconnect();
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

// Reconnection Handler
const handleReconnect = () => {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms...`);
    setTimeout(setupWebSocket, delay);
  } else {
    console.error("Max reconnection attempts reached");
  }
};

// Participant Update Handler
const handleParticipantUpdate = (update) => {
  // Handle different types of participant updates
  switch (update.type) {
    case "new_participant":
      // Show notification for new participant
      showNotification(`${update.name} confirmou presença!`);
      break;

    case "participant_count":
      // Update participant count if needed
      updateParticipantCount(update.count);
      break;
  }
};

// Notification System
const showNotification = (message) => {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  // Add to document
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
};

// Loading State Management
const setLoading = (isLoading) => {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Enviando..." : "Confirmar Presença";
};

// Countdown Timer
const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = EVENT_DATE - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");

  if (distance < 0) {
    clearInterval(countdownInterval);
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
  }
};

// Form Data Collection
const collectFormData = () => {
  const names = Array.from(document.querySelectorAll(".name-input"))
    .map((input) => input.value.trim())
    .filter((name) => name !== "");

  return {
    names,
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
  };
};

// API Calls
const apiCall = async (endpoint, method = "GET", data = null) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Form Submission Handler
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = collectFormData();

    // Validate form data
    if (formData.names.length === 0) {
      throw new Error("Por favor, adicione pelo menos um nome.");
    }

    if (!formData.phone || !formData.email) {
      throw new Error("Por favor, preencha todos os campos obrigatórios.");
    }

    // Simulate API call (replace with actual API endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    alert("Presença confirmada com sucesso!");

    // Reset form
    confirmationForm.reset();
    namesContainer.innerHTML = `
            <div class="form-group">
                <label for="name1">Nome Completo</label>
                <input type="text" class="name-input" id="name1" name="name" required>
            </div>
        `;
  } catch (error) {
    alert(
      error.message || "Erro ao confirmar presença. Por favor, tente novamente."
    );
  } finally {
    setLoading(false);
  }
};

// Add Name Field Handler
const handleAddName = () => {
  const newIndex = namesContainer.children.length + 1;

  const newFormGroup = document.createElement("div");
  newFormGroup.className = "form-group";
  newFormGroup.innerHTML = `
        <label for="name${newIndex}">Nome Completo</label>
        <input type="text" class="name-input" id="name${newIndex}" name="name" required>
    `;

  namesContainer.appendChild(newFormGroup);
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  confirmationForm.addEventListener("submit", handleSubmit);
  addNameButton.addEventListener("click", handleAddName);

  // Initialize WebSocket connection
  setupWebSocket();

  // Initialize countdown
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
});
