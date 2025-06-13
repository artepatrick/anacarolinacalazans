// Configuration
const BASE_URL = "http://localhost:8080";
const EXTERNAL_API_BASE_URL = "http://localhost:8080";
const EVENT_DATE = new Date("2025-06-28T16:00:00"); // Adjust this to the actual event date
const TOLKY_APY_TOKEN = "S30LusdLYOEjsFe2DNa4CVI9ny4Yi8N2YAX7gw9Yapg";

// DOM Elements
const form = document.getElementById("confirmationForm");
const addNameButton = document.getElementById("addNameButton");
const namesContainer = document.getElementById("namesContainer");
const submitButton = document.getElementById("submitButton");

// Countdown Timer
function updateCountdown() {
  const now = new Date();
  const difference = EVENT_DATE - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

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
updateCountdown();

// Add name field
let nameFieldCount = 1;
addNameButton.addEventListener("click", () => {
  nameFieldCount++;
  const newNameField = document.createElement("div");
  newNameField.className = "form-group";
  newNameField.innerHTML = `
        <label for="name${nameFieldCount}">Nome Completo</label>
        <input type="text" class="name-input" id="name${nameFieldCount}" name="name" required placeholder="Digite seu nome completo">
    `;
  namesContainer.appendChild(newNameField);
});

// Phone number mask
const phoneInput = document.getElementById("phone");
phoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 2) {
    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  }
  if (value.length > 9) {
    value = `${value.slice(0, 9)}-${value.slice(9)}`;
  }

  e.target.value = value;
});

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitButton.disabled = true;

  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value.replace(/\D/g, "");
  const names = Array.from(document.querySelectorAll(".name-input"))
    .map((input) => input.value.trim())
    .filter((name) => name !== "");

  // First, check if email exists
  console.log("Checking if email exists:", {
    request: { email },
    expectedResponse: {
      exists: true,
      data: {
        id: "string",
        email: "string",
        phone: "string",
        names: ["string"],
      },
    },
  });

  try {
    const checkResponse = await fetch(`${BASE_URL}/api/niver2025/checkEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const checkData = await checkResponse.json();

    if (!checkResponse.ok) {
      throw new Error("Failed to check email");
    }

    if (checkData.exists) {
      // Show confirmation modal with existing guests
      const confirmed = await showConfirmationModal(checkData.names, names);
      if (!confirmed) {
        submitButton.disabled = false;
        return;
      }
    }

    // Submit the form data
    const formData = {
      email,
      phone,
      names,
    };

    console.log("Submitting form data:", {
      request: formData,
      expectedResponse: {
        success: true,
        id: "string",
      },
    });

    const submitResponse = await fetch(
      `${BASE_URL}/api/niver2025/confirmPresence`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const submitData = await submitResponse.json();

    if (!submitResponse.ok || submitData.code !== 200) {
      throw new Error(submitData.message || "Failed to submit form");
    }

    // Send notifications
    console.log("Sending notifications:", {
      request: {
        data: [
          {
            phone,
            userName: names[0],
            eventType: "aniversario",
            eventDate: EVENT_DATE.toISOString(),
          },
        ],
        generalInstructions:
          "Enviar mensagem de agradecimento pela confirmação de presença no aniversário",
      },
    });

    const notificationResponse = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/externalAPIs/public/externalNotificationAI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOLKY_APY_TOKEN}`,
        },
        body: JSON.stringify({
          data: [
            {
              phone,
              userName: names[0],
              eventType: "aniversario",
              eventDate: EVENT_DATE.toISOString(),
            },
          ],
          generalInstructions:
            "Enviar mensagem de agradecimento pela confirmação de presença no aniversário",
        }),
      }
    );

    const notificationData = await notificationResponse.json();

    if (
      notificationData.code !== 200 ||
      notificationData.data.summary.failedItems > 0
    ) {
      console.warn("Some notifications failed to send:", notificationData);
    }

    showSuccessModal();
    form.reset();
  } catch (error) {
    console.error("Error:", error);
    alert(
      "Ocorreu um erro ao confirmar sua presença. Por favor, tente novamente."
    );
  } finally {
    submitButton.disabled = false;
  }
});

// Modal functions
function showConfirmationModal(existingGuests, newGuests) {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
            <div class="modal-content">
                <h3>Confirmação de Presença</h3>
                <p>Já existem os seguintes convidados confirmados para este email:</p>
                <ul>
                    ${existingGuests
                      .map((guest) => `<li>${guest}</li>`)
                      .join("")}
                </ul>
                <p>Deseja adicionar os novos convidados?</p>
                <ul>
                    ${newGuests.map((guest) => `<li>${guest}</li>`).join("")}
                </ul>
                <div class="modal-buttons">
                    <button id="confirmYes">Sim, confirmar todos</button>
                    <button id="confirmNo">Não, editar</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    document.getElementById("confirmYes").addEventListener("click", () => {
      modal.remove();
      resolve(true);
    });

    document.getElementById("confirmNo").addEventListener("click", () => {
      modal.remove();
      resolve(false);
    });
  });
}

function showSuccessModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h3>Presença Confirmada!</h3>
            <p>Obrigada por confirmar sua presença! Em breve você receberá mais informações sobre o evento.</p>
            <button id="closeModal">Fechar</button>
        </div>
    `;

  document.body.appendChild(modal);

  document.getElementById("closeModal").addEventListener("click", () => {
    modal.remove();
  });
}
