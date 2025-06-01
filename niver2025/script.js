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
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing required configuration. Please check your configuration values."
  );
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
    const response = await fetch(
      `${process.env.TOLKY_API_BASE_URL}/api/externalAPIs/public/externalNotificationAI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOLKY_REASONING_TOKEN}`,
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
          generalInstructions:
            "Estamos enviando uma confirmação de presença para um aniversário. Por favor, envie uma mensagem amigável confirmando a presença e agradecendo o interesse.",
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

    try {
      // Insert the confirmation
      const { data, error } = await supabase
        .from("presence_confirmations")
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      const reportPayload = {
        data: [
          {
            userName: "Ana Carolina",
            phone: "553199455764",
          },
        ],
        generalInstructions: `Explique à Ana Carolina que mais um convidado`,
      };

      // Send notification using Tolky API
      await sendTolkyNotification(reportPayload);

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
    }
  });
