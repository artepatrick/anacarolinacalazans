// Initialize Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { config } from "../config.js";

// Configuration
const SUPABASE_URL = config.SUPABASE_URL;
const SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing required configuration. Please check your configuration values."
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to format date
function formatDate(dateString) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
}

// Function to update last update time
function updateLastUpdate() {
  const now = new Date();
  document.getElementById("lastUpdate").textContent = formatDate(now);
}

// Function to get status badge HTML
function getStatusBadge(status) {
  const statusConfig = {
    confirmado: { color: "bg-green-100 text-green-800", text: "Confirmado" },
    pendente: { color: "bg-yellow-100 text-yellow-800", text: "Pendente" },
    cancelado: { color: "bg-red-100 text-red-800", text: "Cancelado" },
  };
  const config = statusConfig[status.toLowerCase()] || statusConfig.pendente;
  return `<span class="px-2 py-1 text-xs font-medium rounded-full ${config.color}">${config.text}</span>`;
}

// Function to load participants data
async function loadParticipants() {
  try {
    const { data, error } = await supabase
      .from("presence_confirmations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Update stats
    document.getElementById("totalInscritos").textContent = data.length;
    document.getElementById("totalConfirmados").textContent = data.filter(
      (p) => p.status === "confirmado"
    ).length;
    document.getElementById("totalPendentes").textContent = data.filter(
      (p) => p.status === "pendente"
    ).length;
    document.getElementById("totalCancelados").textContent = data.filter(
      (p) => p.status === "cancelado"
    ).length;

    // Update table
    const tableBody = document.getElementById("participantsTable");
    tableBody.innerHTML = data
      .map(
        (participant) => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${
                      participant.names[0]
                    }</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${
                      participant.email
                    }</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${getStatusBadge(participant.status || "pendente")}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${formatDate(
                      participant.created_at
                    )}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-purple-600 hover:text-purple-900 mr-3" onclick="viewDetails('${
                      participant.id
                    }')">Ver detalhes</button>
                    <button class="text-red-600 hover:text-red-900" onclick="deleteParticipant('${
                      participant.id
                    }')">Excluir</button>
                </td>
            </tr>
        `
      )
      .join("");

    updateLastUpdate();
  } catch (error) {
    console.error("Error loading participants:", error);
  }
}

// Function to view participant details
async function viewDetails(id) {
  try {
    const { data, error } = await supabase
      .from("presence_confirmations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Show details in a modal or alert
    alert(`
            Nomes: ${data.names.join(", ")}
            Email: ${data.email}
            Telefone: ${data.phone}
            Data de inscrição: ${formatDate(data.created_at)}
        `);
  } catch (error) {
    console.error("Error viewing details:", error);
    alert("Erro ao carregar detalhes do participante");
  }
}

// Function to delete participant
async function deleteParticipant(id) {
  if (confirm("Tem certeza que deseja excluir este participante?")) {
    try {
      const { error } = await supabase
        .from("presence_confirmations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("Participante excluído com sucesso!");
      loadParticipants(); // Reload the list
    } catch (error) {
      console.error("Error deleting participant:", error);
      alert("Erro ao excluir participante");
    }
  }
}

// Load data when page loads
document.addEventListener("DOMContentLoaded", loadParticipants);

// Refresh data every 5 minutes
setInterval(loadParticipants, 5 * 60 * 1000);
