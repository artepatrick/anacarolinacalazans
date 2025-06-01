// Countdown Timer
function updateCountdown() {
  const birthday = new Date("2025-06-28T16:00:00");
  const now = new Date();
  const diff = birthday - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0"
  );
  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0"
  );
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial update

// Initialize Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Configuration
const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing required configuration. Please check your configuration values."
  );
  console.log("SUPABASE_URL:", SUPABASE_URL);
  console.log("SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY);
  throw new Error("Supabase configuration is missing");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Add name input field
document.getElementById("addNameButton").addEventListener("click", () => {
  const namesContainer = document.getElementById("namesContainer");
  const newNameGroup = document.createElement("div");
  newNameGroup.className = "form-group";
  newNameGroup.innerHTML = `
    <label for="name">Nome Completo</label>
    <div class="name-input-group">
      <input type="text" class="name-input" name="name" required>
      <button type="button" class="remove-name-button">×</button>
    </div>
  `;
  namesContainer.appendChild(newNameGroup);

  // Add event listener to remove button
  newNameGroup
    .querySelector(".remove-name-button")
    .addEventListener("click", () => {
      namesContainer.removeChild(newNameGroup);
    });
});

// Function to send notification using Tolky API
async function sendTolkyNotification(userData) {
  try {
    const standard =
      "Estamos enviando uma confirmação de presença para um aniversário. Por favor, envie uma mensagem amigável confirmando a presença e agradecendo o interesse.";
    const response = await fetch(
      `${
        import.meta.env.TOLKY_API_BASE_URL
      }/api/externalAPIs/public/externalNotificationAI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.TOLKY_REASONING_TOKEN}`,
        },
        body: JSON.stringify({
          data: [
            {
              userName: userData.names[0],
              email: userData.email,
              phone: userData.phone,
              eventType: "birthday",
              eventDate: "2025-06-28",
            },
          ],
          generalInstructions: userData.generalInstructions || standard,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

// Modify the form submission handler to include notification
document
  .getElementById("confirmationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = document.getElementById("submitButton");
    const buttonText = submitButton.querySelector(".button-text");
    const loadingSpinner = submitButton.querySelector(".loading-spinner");

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.classList.add("loading");

    try {
      // Get all names
      const nameInputs = document.querySelectorAll(".name-input");
      const names = Array.from(nameInputs)
        .map((input) => input.value.trim())
        .filter((name) => name !== "");

      if (names.length === 0) {
        alert("Por favor, adicione pelo menos um nome.");
        return;
      }

      const formData = {
        names: names,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        status: "pendente",
        created_at: new Date().toISOString(),
      };

      // Insert the confirmation
      const { data, error } = await supabase
        .from("presence_confirmations")
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // Send notification using Tolky API
      await sendTolkyNotification({
        names: names,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        generalInstructions: `Explique à Ana Carolina que mais um convidado confirmou presença.`,
      });

      // Show success message
      alert("Presença confirmada com sucesso!");
      document.getElementById("confirmationForm").reset();

      // Reset to single name input
      const namesContainer = document.getElementById("namesContainer");
      namesContainer.innerHTML = `
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input type="text" class="name-input" name="name" required>
        </div>
      `;
    } catch (error) {
      console.error("Error:", error);
      alert("Erro ao confirmar presença. Por favor, tente novamente.");
    } finally {
      // Re-enable button and hide loading state
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
    }
  });
