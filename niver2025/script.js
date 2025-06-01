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

// Environment check logging
console.log("Environment check:", {
  hasSupabaseUrl: !!SUPABASE_URL,
  hasSupabaseKey: !!SUPABASE_ANON_KEY,
  hasTolkyApiUrl: !!import.meta.env.TOLKY_API_BASE_URL,
  hasTolkyToken: !!import.meta.env.TOLKY_REASONING_TOKEN,
});

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
    console.log("Starting Tolky notification process...");
    console.log("User data:", userData);

    const standard =
      "Estamos enviando uma confirmação de presença para um aniversário. Por favor, envie uma mensagem amigável confirmando a presença e agradecendo o interesse.";
    const apiBaseUrl = import.meta.env.TOLKY_API_BASE_URL;

    console.log("API Configuration:", {
      apiBaseUrl: apiBaseUrl ? "Configured" : "Missing",
      hasToken: !!import.meta.env.TOLKY_REASONING_TOKEN,
    });

    if (!apiBaseUrl) {
      console.warn("TOLKY_API_BASE_URL not configured, skipping notification");
      return { success: true, skipped: true };
    }

    const requestBody = {
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
    };

    console.log("Sending request to Tolky API:", {
      url: `${apiBaseUrl}/api/externalAPIs/public/externalNotificationAI`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer [REDACTED]", // Don't log the actual token
      },
      body: requestBody,
    });

    const response = await fetch(
      `${apiBaseUrl}/api/externalAPIs/public/externalNotificationAI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.TOLKY_REASONING_TOKEN}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("Tolky API response status:", response.status);
    console.log(
      "Tolky API response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tolky API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const result = await response.json();
    console.log("Tolky API success response:", result);
    return result;
  } catch (error) {
    console.error("Error sending notification:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return { success: false, error: error.message };
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

      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;

      console.log("Checking for existing email:", email);

      // Check if email already exists
      const { data: existingData, error: fetchError } = await supabase
        .from("presence_confirmations")
        .select("*")
        .eq("email", email)
        .single();

      console.log("Supabase response:", {
        existingData,
        fetchError,
        errorCode: fetchError?.code,
        errorMessage: fetchError?.message,
        errorDetails: fetchError?.details,
      });

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Supabase query error:", {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
        });
        throw fetchError;
      }

      let finalData;
      let shouldProceed = true;

      if (existingData) {
        // Merge existing names with new names
        const existingNames = existingData.names || [];
        const mergedNames = [...new Set([...existingNames, ...names])];

        finalData = {
          names: mergedNames,
          phone: phone,
          email: email,
          status: "pendente",
          created_at: existingData.created_at,
          updated_at: new Date().toISOString(),
        };

        // Show confirmation dialog
        const confirmMessage = `
          Encontramos um registro existente para este email com os seguintes nomes:
          ${existingNames.join(", ")}

          Os novos nomes a serem adicionados são:
          ${names.join(", ")}

          Após a confirmação, a lista final será:
          ${mergedNames.join(", ")}

          Deseja prosseguir com esta atualização?
        `;

        shouldProceed = confirm(confirmMessage);
      } else {
        finalData = {
          names: names,
          phone: phone,
          email: email,
          status: "pendente",
          created_at: new Date().toISOString(),
        };
      }

      if (!shouldProceed) {
        return;
      }

      console.log("Attempting to save data:", finalData);

      // Insert or update the confirmation
      const { data, error } = existingData
        ? await supabase
            .from("presence_confirmations")
            .update(finalData)
            .eq("email", email)
            .select()
            .single()
        : await supabase
            .from("presence_confirmations")
            .insert([finalData])
            .select()
            .single();

      if (error) {
        console.error("Error saving to Supabase:", error);
        throw error;
      }

      console.log("Successfully saved to Supabase:", data);

      const NOTIFICATION_PHONE = "5531991391722";
      const NOTIFICATION_PHONE02 = "553199455764";

      // Send notification using Tolky API for first phone
      const notificationResult = await sendTolkyNotification({
        names: finalData.names,
        email: finalData.email,
        phone: NOTIFICATION_PHONE,
        generalInstructions: `Explique ao Patrick que ${
          existingData
            ? "mais convidados foram adicionados à confirmação existente"
            : "novos convidados confirmaram presença"
        }. Nomes: ${finalData.names.join(", ")}. Email: ${
          finalData.email
        }. Telefone: ${finalData.phone}.`,
      });

      console.log("Notification result:", notificationResult);

      // Send notification using Tolky API for second phone
      const notificationResult2 = await sendTolkyNotification({
        names: finalData.names,
        email: finalData.email,
        phone: NOTIFICATION_PHONE02,
        generalInstructions: `Explique à Ana Carolina que ${
          existingData
            ? "mais convidados foram adicionados à confirmação existente"
            : "novos convidados confirmaram presença"
        }. Nomes: ${finalData.names.join(", ")}. Email: ${
          finalData.email
        }. Telefone: ${finalData.phone}.`,
      });

      // Show success message
      if (notificationResult.skipped) {
        alert(
          "Presença confirmada com sucesso! (Notificação não enviada - configuração pendente)"
        );
      } else if (!notificationResult.success) {
        alert(
          "Presença confirmada com sucesso! (Notificação não enviada - erro na configuração)"
        );
      } else {
        alert("Presença confirmada com sucesso!");
      }
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
