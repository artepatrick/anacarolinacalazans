// Initialize Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing required environment variables. Please check your .env file."
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

    // Show warning if more than one name is provided
    if (names.length > 1) {
      alert("Atenção: Apenas o primeiro nome será salvo no sistema.");
    }

    const formData = {
      name: names[0], // Only send the first name
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("presence_confirmations")
        .insert([formData]);

      if (error) throw error;

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
