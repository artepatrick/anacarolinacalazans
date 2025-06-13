# Geral
Vamos construir as APIs de uma aplicação de aniversário. 

## Front
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#1A202C">
    <meta name="description" content="Confirme sua presença para o aniversário de Ana Carolina Calazans">
    <title>Ana Carolina Calazans - Confirmação de Presença</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="profile-section">
                <img src="https://tolky.to/_next/image?url=https%3A%2F%2Fi.postimg.cc%2FT2tQppZB%2Fcarol-comprimida.jpg&w=1920&q=75" 
                     alt="Ana Carolina Calazans" 
                     class="profile-image"
                     loading="lazy">
                <h1>Ana Carolina Calazans</h1>
                <p class="subtitle">Confirme sua presença</p>
            </div>

            <div class="countdown-section">
                <h2>Faltam</h2>
                <div class="countdown-container">
                    <div class="countdown-value">
                        <span id="days">00</span>
                        <span class="countdown-label">Dias</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-value">
                        <span id="hours">00</span>
                        <span class="countdown-label">Horas</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-value">
                        <span id="minutes">00</span>
                        <span class="countdown-label">Minutos</span>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-value">
                        <span id="seconds">00</span>
                        <span class="countdown-label">Segundos</span>
                    </div>
                </div>
                <p class="countdown-message">para o grande dia!</p>
            </div>

            <form id="confirmationForm" class="form-container">
                <div id="namesContainer">
                    <div class="form-group">
                        <label for="name1">Nome Completo</label>
                        <input type="text" class="name-input" id="name1" name="name" required placeholder="Digite seu nome completo">
                    </div>
                </div>

                <button type="button" id="addNameButton" class="add-name-button">+ Adicionar mais um nome</button>

                <div class="form-group">
                    <label for="phone">Telefone</label>
                    <input type="tel" id="phone" name="phone" required placeholder="(00) 00000-0000">
                </div>

                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" name="email" required placeholder="seu@email.com">
                </div>

                <div class="form-group">
                    <label for="musicSearch">Sugerir Músicas</label>
                    <p class="music-description">Escolha suas músicas favoritas e ajude a festa a ser diversa e criativa! Basta digitar o nome da música, banda ou autor!</p>
                    <p class="music-description" style="color: var(--chakra-colors-gray-100); font-style: italic;">Funcionalidade temporariamente indisponível</p>
                    <div class="music-search-container">
                        <div class="search-input-wrapper">
                            <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text" id="musicSearch" placeholder="Busque uma música..." disabled>
                        </div>
                        <div id="searchResults" class="search-results"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Músicas Sugeridas</label>
                    <div id="suggestedMusic" class="suggested-music-list"></div>
                </div>

                <button type="submit" class="submit-button" id="submitButton">
                    Confirmar Presença
                </button>
            </form>
        </div>
    </div>

    <script src="main.js"></script>
</body>
</html>
```

## Comportamento geral
- O usuário deve ser capaz de adicionar mais de um nome de convidado.
- O telefone é fortemente recomendado, mas não é obrigatório.
- A sugestão de música está temporariamente indisponível.
- O email é chave primária para confirmar a presença.
- Quando o usuário clicar no botão de confirmar, vamos seguir os seguintes critérios:
-- Consultamos a tabela de confirmação de presença para ver se o email já existe (backend).
-- Se o email não existe na tabela de confirmação de presença, vamos criar uma nova entrada com os dados do usuário e em seguida fornecer uma modal que confirme ao usuário que a confirmação foi salva
-- Se o email já existe, vamos adicionar à lista de convidados os convidados que já estavam na base, pedindo ao usuário para confirmar se deseja confirmar a presença de todos os convidados da lista ou se deseja fazer alguma edição.
-- Após a confirmação do usuário, chamamos a rota de gravação, que vai sobrescrever o que estiver na base para aquele usuário tomando como verdade o que está chegando na requisição que o usuário aprovou.
- Após a confirmação do usuário, vamos utilizar o **tolkyReasoning** da documentação a seguir para enviar uma mensagem para o usuário e outra para o dono do avatar (backend).


## Documentação da API de disparo
Chamada à Rota externalNotificationAI
Endpoint:

bash
Copiar
Editar
POST /api/externalAPIs/public/externalNotificationAI
Headers:

http
Copiar
Editar
Content-Type: application/json
Authorization: Bearer {SEU_TOKEN_DE_ACESSO}
Body (JSON):

json
Copiar
Editar
{
  "data": [
    {
      "phone": "31999999999",
      "userName": "João Silva",
      "productInterest": "Sedan Luxo"
    },
    {
      "phone": "31888888888",
      "userName": "Maria Santos",
      "productInterest": "SUV Compacto"
    }
  ],
  "generalInstructions": "Enviar mensagens personalizadas sobre os veículos de interesse, destacando promoções atuais."
}
Campos:

data (array, obrigatório): lista de destinatários com dados contextuais

phone (string, obrigatório)

outros campos opcionais para personalização (ex: userName, productInterest)

generalInstructions (string, opcional): instrução geral para IA sobre como agir com os dados

Resposta (exemplo):

json
Copiar
Editar
{
  "code": 200,
  "message": "OK",
  "data": {
    "results": [{ "status": "fulfilled", "value": { "phone": "31999999999", "whatsappStatus": "success" } }],
    "summary": {
      "totalItems": 2,
      "sentItems": 2,
      "failedItems": 0
    }
  }
}