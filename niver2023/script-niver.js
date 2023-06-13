if (typeof navigator !== "undefined" && navigator.userAgentData) {
  // Use navigator.userAgentData when available
  const userAgent = navigator.userAgentData;
  // Access the desired information from userAgent
} else {
  // Fallback to navigator.userAgent for unsupported browsers
  const userAgent = navigator.userAgent;
}

document.cookie = "firstName=BobEsponja; SameSite=None; Secure expires=true";

const form = document.getElementById("apiForm");
const button = document.getElementById("button");
const inputName = document.getElementById("name");
const button2 = document.getElementById("button2");
const inputEmail = document.getElementById("email");
const listContainer = document.getElementById("list");
const statusResponse = document.getElementById("response");
const formulario = document.getElementById("Formulario");
const confirmaPresenca = document.getElementById("presencaConfirmadaBox");
const mensagemInicial = document.getElementById("mensagemInicial");
const GDrive = document.getElementById("GDrive");

if (!GDrive) {
  console.log(`Essa página não possui lógica de convidados`);
} else {
  GDrive.style.display = "none";

  const inicioDaFesta = triggerData(24, 6, 2023, 13);
  console.log(`Início da festa: ${inicioDaFesta}`);
  const finalDaFesta = triggerData(24, 6, 2023, 17);
  console.log(`\nFinal da Festa: ${finalDaFesta}`);

  if (inicioDaFesta && !finalDaFesta) {
    formulario.style.display = "none";
    mensagemInicial.innerHTML = `<h1 style="color: #9B51E0">Já começou!</h1>
    <p>Já estamos aqui... Sò vem</p>
    <p>A festa já começou, não precisa fazer reserva. Basta comparecer no <a style="text-decoration: none;" href="#addressBox"><span style="font-weight:bolder; font-weight: bolder; color: #9B51E0;">Prainha botiquim</span></a></p>
    <p><a style="text-decoration: none;" href="#addressBox"><span style="font-weight:bolder; font-weight: bolder; color: #9B51E0;">Clique</span></a> para ver o endereço<p/>`;
  }

  if (finalDaFesta) {
    formulario.style.display = "none";
    GDrive.style.display = "block";
    mensagemInicial.innerHTML = `<h1 style="color: #9B51E0">Obrigado Pela presença!</h1>
      <p>Foi muito bom porder compartilhar um início de ciclo com amigos e família.</p>
      <p>Quem me conhece sabe a importância das pessoas para mim!</p>
      <p>Preparamos uma pasta com as fotos tiradas no dia. FIque à vontade para baixar e compartilhar.<p/>`;
  }
}

listContainer.style.display = "none";
statusResponse.style.display = "none";
if (confirmaPresenca) {
  confirmaPresenca.style.display = "none";
}

if (!form) {
  console.log("não existe form nessa página...");
} else {
  form.addEventListener("click", () => {
    statusResponse.textContent = "";
    statusResponse.style.opacity = "1";
    statusResponse.style.display = "none";
    listContainer.style.display = "none";
  });
}

if (!form) {
  console.log("não existe form nessa página...");
} else {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission
    button.textContent = "AGUARDE...";
    button.style = "background-color: #606060";
    button.ariaDisabled = true;
    statusResponse.style.display = "block";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const primeiroNome = getFirstWord(name);
    const time = new Date();
    const ipAddress = "";;
    const region = ""; 
    try{
      ipAddress = await getIPAddress();
      region = await getRegion();
    }catch{
      ipAddress = "";
      region = "";
      console.log("Não foi possível obter o IP ou a região");
    }
    
    try {
      const envio = await gravaUser(name, email, region, ipAddress, time);
      console.log(`Envio realizado para o banco: \n${JSON.stringify(envio)}`);
      if (!envio) {
        console.log('ATENÇÃO!\nA API não retornou nada no POST do "/User"...');
      } else {
        console.log(`(!envio) = false - ;)`);
      }
    } catch (error) {
      console.log(error);
    }
    button.textContent = "Eu vou!";
    button.style = "background-color: #9B51E0";
    button.ariaDisabled = false;
    inputName.value = "";
    inputEmail.value = "";
    confirmaPresenca.style.display = "block";
    statusResponse.textContent = `Que bom que você virá, ${primeiroNome}!`;
    showResponse();
  });
}

if (!button2) {
  console.log(
    "Essa página não possui Button2\nUse a rota da página de confirmados\nhttps://www.anacarolinacalazans.com.br/niver2023/confirmados.html"
  );
} else {
  button2.addEventListener("click", async () => {
    button2.textContent = "AGUARDE...";
    console.log("clique no botão...");
    try {
      const data = await getUsers();
      console.log(
        `>> Puxando os registros todos...\n\n${JSON.stringify(data)}`
      );
      displayUserNames(data);
      button2.textContent = "Atualizar Lista";
    } catch (error) {
      console.log(
        `A lógica de mostrar todos os registros quebrou...\nerro: ${error}`
      );
    }
  });
}

async function gravaUser(name, email, region, ipAddress, time) {
  const response = {
    userName: name,
    email: email,
    region,
    ipAddress,
    time,
  };
  console.log(`Response\n${JSON.stringify(response)}`);

  const apiReturn = await fetch(
    "https://artepatrick-mongodb-api.herokuapp.com/niver",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    }
  );
  console.log(
    `Response enviado via API:\n${JSON.stringify(
      response
    )}\nretorno da api:\n${apiReturn}`
  );
  return apiReturn;
}

async function getRegion() {
  try {
    const position = await getCurrentPosition();
    return await getRegionByCoords(position.coords);
  } catch (error) {
    handleLocationError(error);
    return "Acesso à localização negado pelo usuário";
  }
}

function handleLocationError(error) {
  if (error.code === 1) {
    console.log("Usuário negou fornecer a localização\nerro:\n", error);
  } else {
    console.error("Error getting region:", error);
  }
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation is not supported"));
    }
  });
}

function getRegionByCoords({ latitude, longitude }) {
  return fetch(
    `https://geolocation-api-provider.com/region?lat=${latitude}&lon=${longitude}`
  ).then(response => response.json());
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

if (!document.getElementById("days")) {
  console.log("não tem countdown nessa página...");
} else {
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

  const countdownDate = new Date("June 24, 2023 14:00:00");
  initializeClock(countdownDate);
}

function getFirstWord(str) {
  // Trim leading and trailing whitespace
  const trimmedStr = str.trim();

  // Find the index of the first space character
  const spaceIndex = trimmedStr.indexOf(" ");

  if (spaceIndex === -1) {
    // If no space is found, the entire string is considered as the first word
    return trimmedStr;
  } else {
    // Extract the substring from the start of the string till the first space
    const firstWord = trimmedStr.substring(0, spaceIndex);
    return firstWord;
  }
}

async function getUsers() {
  console.log("Getting users...");
  const response = await fetch(
    "https://artepatrick-mongodb-api.herokuapp.com/niver",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    console.log("ATENÇÃO!!\nnão rolou o Fetch!");
    throw new Error("Failed to fetch user data");
  }
  const data = await response.json();
  return data;
}

function displayUserNames(data) {

  const userList = document.getElementById("userList");
  const listContainer = document.getElementById("list");
  userList.innerHTML = "";

  if (!userList) {
    console.log("Não existe exibição de lista nessa página.");
  } else {
    listContainer.style.display = "block";

    try {
      console.log("Iniciando o for...");

      for (let i = 0; i < data.length; i++) {
        const user = data[i];

        console.log("Usuário isolado do banco de dados\n", user);
        const userName = user.userName;
        console.log(`\nuserName: ${userName}\n`);
        const listItem = document.createElement("li");
        listItem.textContent = userName;
        listItem.style.display = "flex";
        listItem.style.flexDirection = "row";
        listItem.style.justifyContent = "space-between";
        listItem.style.alignItems = "center";
        console.log(listItem);
        // Append the <li> element to the user list
        if (user.email) {
          const check = document.createElement("img");
          check.src = "https://i.postimg.cc/pdqSqdtp/check.png";
          check.style.width = "20px";
          check.style.margin = "0 5px";
          listItem.appendChild(check);
          userList.appendChild(listItem);
          //ad a floating modal on the image hover
          const modal = document.createElement("div");
          modal.classList.add("modal");
          modal.style.display = "none"; // Initially hide the modal
          modal.style.position = "absolute";
          // make the modal appear in the righ end of the box

          modal.style.transform = `${user.email.length}px`;
          modal.style.color = "#fff";
          modal.style.fontFamily = "'Sono', sans-serif, font-weight: 700;";
          modal.style.fontSize = "14px"; // Font size of the modal
          modal.style.backgroundColor = "#9B51E0"; // Background color of the modal
          modal.style.padding = "10px"; // Padding of the modal
          modal.style.border = "1px solid #ccc"; // Border of the modal
          modal.style.zIndex = "1"; // Set a higher z-index to appear above other elements
          listItem.appendChild(modal);
          const modalText = document.createElement("p");
          modalText.textContent = user.email;
          modal.appendChild(modalText);

          listItem.addEventListener("mouseover", () => {
            listItem.style.fontWeight = "bold";
            listItem.style.cursor = "pointer";
            listItem.style.color = "#F2C94C";
          });
          listItem.addEventListener("mouseout", () => {
            listItem.style.fontWeight = "normal";
            listItem.style.color = "#606060";
          });

          check.addEventListener("mouseover", () => {
            let region = user.region ? ` | ${user.region}` : "";
            modalText.textContent = `${user.email}${region}`;
            modal.style.display = "block";
            console.log(`passando no mouseover - ${user.email}`);
          });
          check.addEventListener("mouseout", () => {
            modal.style.display = "none";
          });

          check.addEventListener("click", () => {
            navigator.clipboard.writeText(user.email);
            alert("Email copiado para a área de transferência!\n\n" + user.email);
          });

          console.log(`Passando no for:\n${listItem}`);
        } else {
          const noCheck = document.createElement("img");
          noCheck.src = "https://i.postimg.cc/J7fRbpqS/noCheck.png";
          noCheck.style.width = "20px";
          noCheck.style.margin = "0 5px";
          listItem.appendChild(noCheck);
          userList.appendChild(listItem);
          console.log(`Passando no for:\n${listItem}`);
        }
      }

      const totalUsers = document.createElement("p");
      totalUsers.style.fontWeight = "bold";
      totalUsers.style.marginTop = "1rem";
      if (data.length > 0) {
        totalUsers.textContent = `Total de convidados confirmados: ${data.length}`;
      } else {
        totalUsers.textContent = "Não há convidados confirmados";
      }
      userList.appendChild(totalUsers);
    } catch (error) {
      console.log(
        `Não deu para tratar a lista dos convidados confirmados...\nErro\n${error}`
      );
    }
    // After listing the users, add a <p> element containing the total number of users listed
    const modal = document.createElement("div");
    modal.classList.add("modal");
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    const modalText = document.createElement("p");
    modalText.textContent = "usuário inseriu email?";
    modalContent.appendChild(modalText);
    modal.appendChild(modalContent);
    check.addEventListener("mouseover", () => {
      // change the modalText.textContent to the user.email
      modalText.textContent = user.email;
      modal.style.display = "block";
      console.log("Passou no mouseover");
    });
    check.addEventListener("mouseout", () => {
      modal.style.display = "none";
    });

  }
}

function showResponse() {
  const responseDiv = document.getElementById("response");
  responseDiv.classList.add("show");
}

function triggerData(diaTrigger, mesTrigger, anoTrigger, horaTrigger) {
  const today = new Date();
  const dia = today.getDate();
  const mes = today.getMonth() + 1;
  const hora = today.getHours();
  const ano = today.getFullYear();

  console.log(
    `Iniciando verificação de dia...\nData Target: ${diaTrigger}/${mesTrigger}/${anoTrigger}, às ${hora} horas\nData de hoje: ${dia}/${mes}/${ano}`
  );

  if (dia === diaTrigger && ano >= anoTrigger && mes >= mesTrigger) {
    console.log("Passou na primeira lógica!");
    return true;
  } else {
    if (
      dia >= diaTrigger &&
      ano >= anoTrigger &&
      mes >= mesTrigger &&
      hora >= horaTrigger
    ) {
      console.log("Trigger de data  do segundo if atingida!");
      return true;
    } else {
      console.log(`Ainda não chegou na data aguardada!`);
      return false;
    }
  }
}

/* async function sendEmail(from, to, subject, message) {
  let requestData;
  if (!from || !to) {
    console.log("from ou to vieram vazios e vamos adicionar valores padrão");
    requestData = {
      from: "teste from",
      to: "teste to",
      subject,
      message: "Teste de corpo de mensagem",
    };
  } else {
    requestData = {
      from: from,
      to: to,
      subject,
      message: message,
    };
  }
  console.log(requestData);
  try {
    const response = await fetch(
      "https://artepatrick-mongodb-api.herokuapp.com/sendmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );
  } catch (error) {
    console.log(`deu ruim na tentativa de fazer o fetch...\n${error}`);
  }
} */
