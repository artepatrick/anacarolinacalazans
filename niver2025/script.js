// Initialize Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { config } from "./config.js";

// Configuration
const SUPABASE_URL = config.SUPABASE_URL;
const SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY;

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

// Form submission handler
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
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      created_at: new Date().toISOString(),
    };

    try {
      // Start a transaction by inserting the main confirmation
      const { data: confirmationData, error: confirmationError } =
        await supabase
          .from("presence_confirmations")
          .insert([formData])
          .select()
          .single();

      if (confirmationError) throw confirmationError;

      // Insert all names
      const namesData = names.map((name) => ({
        presence_confirmation_id: confirmationData.id,
        name: name,
        created_at: new Date().toISOString(),
      }));

      const { error: namesError } = await supabase
        .from("presence_confirmation_names")
        .insert(namesData);

      if (namesError) throw namesError;

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
