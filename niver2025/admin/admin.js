// Import API service functions
import {
  getParticipants,
  deleteParticipant as apiDeleteParticipant,
  getParticipantCount,
} from "../api.js";

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

// Function to toggle participant status
async function toggleStatus(id, currentStatus) {
  try {
    const newStatus =
      currentStatus === "confirmado" ? "pendente" : "confirmado";
    const response = await fetch(
      `${window.location.origin}/api/participants/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    loadParticipants(); // Reload the list to show updated status
  } catch (error) {
    console.error("Error toggling status:", error);
    alert("Erro ao alterar status do participante");
  }
}

// Make functions available globally
window.toggleStatus = toggleStatus;
window.viewDetails = viewDetails;
window.deleteParticipant = deleteParticipant;

// Function to load participants data
async function loadParticipants() {
  try {
    const data = await getParticipants();

    // Calculate total number of people by summing up the length of names arrays
    const totalPeople = data.reduce(
      (sum, participant) => sum + participant.names.length,
      0
    );
    const confirmedPeople = data
      .filter((p) => p.status === "confirmado")
      .reduce((sum, participant) => sum + participant.names.length, 0);
    const pendingPeople = data
      .filter((p) => p.status === "pendente")
      .reduce((sum, participant) => sum + participant.names.length, 0);
    const cancelledPeople = data
      .filter((p) => p.status === "cancelado")
      .reduce((sum, participant) => sum + participant.names.length, 0);

    // Update stats
    document.getElementById("totalInscritos").textContent = totalPeople;
    document.getElementById("totalConfirmados").textContent = confirmedPeople;
    document.getElementById("totalPendentes").textContent = pendingPeople;
    document.getElementById("totalCancelados").textContent = cancelledPeople;

    // Update table
    const tableBody = document.getElementById("participantsTable");
    tableBody.innerHTML = data
      .map(
        (participant) => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${participant.names.join(
                      ", "
                    )}</div>
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
                    <button class="text-green-600 hover:text-green-900 mr-3" onclick="toggleStatus('${
                      participant.id
                    }', '${participant.status}')">
                        ${
                          participant.status === "confirmado"
                            ? "Marcar como Pendente"
                            : "Confirmar Presença"
                        }
                    </button>
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
    const response = await fetch(
      `${window.location.origin}/api/participants/${id}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch participant details");
    }
    const data = await response.json();

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
      await apiDeleteParticipant(id);
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
