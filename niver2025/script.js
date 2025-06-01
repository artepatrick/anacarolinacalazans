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

// Import API service
import { addParticipant, getParticipants, sendNotification } from "./api.js";

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

      // Get existing participants
      const participants = await getParticipants();
      const existingParticipant = participants.find((p) => p.email === email);

      let finalData;
      let shouldProceed = true;

      if (existingParticipant) {
        // Merge existing names with new names
        const existingNames = existingParticipant.names || [];
        const mergedNames = [...new Set([...existingNames, ...names])];

        finalData = {
          names: mergedNames,
          phone: phone,
          email: email,
          status: "pendente",
          created_at: existingParticipant.created_at,
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

      if (shouldProceed) {
        // Add participant through API
        const result = await addParticipant(finalData);

        // Send notification through backend
        const notificationResult = await sendNotification(finalData);

        if (notificationResult.success) {
          alert(
            "Confirmação de presença registrada com sucesso! Você receberá uma confirmação em breve."
          );
          document.getElementById("confirmationForm").reset();
          // Remove all name inputs except the first one
          const namesContainer = document.getElementById("namesContainer");
          while (namesContainer.children.length > 1) {
            namesContainer.removeChild(namesContainer.lastChild);
          }
        } else {
          alert(
            "Confirmação registrada, mas houve um problema ao enviar a notificação. Por favor, tente novamente mais tarde."
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."
      );
    } finally {
      // Re-enable button and hide loading state
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
    }
  });
