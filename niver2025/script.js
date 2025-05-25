// Initialize Supabase client
import { createClient } from "@supabase/supabase-js";

// Load environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Form submission handler
document
  .getElementById("confirmationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
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
    } catch (error) {
      console.error("Error:", error);
      alert("Erro ao confirmar presença. Por favor, tente novamente.");
    }
  });
