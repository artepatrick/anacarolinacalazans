const form = document.getElementById("apiForm");
const button = document.getElementById("button");
const inputName = document.getElementById("name");
const statusResponse = document.getElementById("response");

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission
  button.textContent = "AGUARDE...";
  button.style = "background-color: #606060";
  button.ariaDisabled = true;

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const ipAddress = await getIPAddress();
  const region = await getRegion();
  const time = new Date();

  try {
    const envio = await gravaUser(name, email, region, ipAddress, time);
    if (!envio) {
      console.log('ATENÇÃO!\nA API não retornou nada no POST do "/User"...');
    } else {
      console.log(`Envio realizado para o banco: \n${JSON.stringify(envio)}`);
    }
  } catch (error) {
    console.log(error);
  }
  button.textContent = "Eu vou!";
  button.style = "background-color: #9B51E0";
  button.ariaDisabled = false;
  inputName.value = "";
  inputEmail.value = "";
  statusResponse.textContent = "Que bom que você vem!";
});

async function gravaUser(name, email, region, ipAddress, time) {
  const response = {
    userName: name,
    email: email,
    region,
    ipAddress,
    time,
  };

  const apiReturn = await fetch(
    "https://artepatrick-mongodb-api.herokuapp.com/niver",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    }
  );
  console.log(`Response enviado via API:\n${response}`);
  return apiReturn;
}

async function getRegion() {
  try {
    const response = await fetch("http://ip-api.com/json");
    const data = await response.json();
    return data.region;
  } catch (error) {
    console.error("Error getting region:", error);
    return null;
  }
}

async function getIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error getting IP address: ", error);
    return null;
  }
}

function getTimeRemaining(endTime) {
  const total = Date.parse(endTime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

function initializeClock(endTime) {
  const daysSpan = document.getElementById("days");
  const hoursSpan = document.getElementById("hours");
  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");

  function updateClock() {
    const timeRemaining = getTimeRemaining(endTime);

    daysSpan.textContent = ("0" + timeRemaining.days).slice(-2);
    hoursSpan.textContent = ("0" + timeRemaining.hours).slice(-2);
    minutesSpan.textContent = ("0" + timeRemaining.minutes).slice(-2);
    secondsSpan.textContent = ("0" + timeRemaining.seconds).slice(-2);

    if (timeRemaining.total <= 0) {
      clearInterval(timeInterval);
    }
  }

  updateClock();
  const timeInterval = setInterval(updateClock, 1000);
}

const countdownDate = new Date("June 24, 2023 00:00:00");
initializeClock(countdownDate);
