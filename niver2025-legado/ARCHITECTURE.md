# Arquitetura do Projeto Niver2025 🏗️

## 1. Visão Geral da Arquitetura

O projeto Niver2025 é uma aplicação web full-stack que utiliza uma arquitetura moderna baseada em:
- Frontend: Vite + JavaScript
- Backend: Node.js + Netlify Functions
- Serviços: Spotify API + Supabase

## 2. Estrutura de Diretórios

```
niver2025/
├── admin/             # Área administrativa do projeto
├── assets/           # Recursos estáticos (imagens, etc)
├── config/           # Configuração centralizada
│   └── index.js     # Configuração principal
├── dist/             # Arquivos de build
├── netlify/          # Funções serverless
│   └── functions/   # Endpoints da API
│       ├── api.js   # API principal
│       ├── spotify-callback.js # Callback do Spotify
│       └── spotify/ # Endpoints do Spotify
├── public/           # Arquivos estáticos
├── server/           # Código do backend
│   └── services/    # Serviços do backend
│       └── spotify/ # Serviço Spotify
├── src/             # Código fonte do frontend
│   ├── main.js     # Ponto de entrada do frontend
│   └── services/   # Serviços do frontend
│       ├── api.js  # Cliente API centralizado
│       └── config.js # Configuração do frontend
├── UTILS/           # Utilitários e helpers
├── .netlify/        # Configurações do Netlify
├── .gitignore       # Configuração do Git
├── .npmrc           # Configuração do NPM
├── .nvmrc           # Versão do Node.js
├── build-config.js  # Configuração de build
├── config.js        # Configurações do projeto
├── config.template.js # Template de configuração
├── database.sql     # Schema do banco de dados
├── design.md        # Documentação de design
├── index.html       # Página principal
├── music.js         # Lógica de música e integração Spotify (frontend)
├── netlify.toml     # Configuração do Netlify
├── package.json     # Dependências e scripts
├── script.js        # Scripts principais
├── spotify-api-docs.md # Documentação da API Spotify
├── spotify-service.js  # Serviço Spotify (frontend)
├── styles.css       # Estilos CSS
└── vite.config.js   # Configuração do Vite
```

## 3. Componentes Principais

### 3.1 Configuração Centralizada (`config/`)

- **index.js**: Configuração principal do projeto
  - Ambiente (desenvolvimento/produção)
  - URLs e endpoints
  - Configurações do Spotify
  - Configurações do Supabase
  - Validação de variáveis de ambiente
  - Configurações do servidor

### 3.2 Frontend (`src/`)

#### 3.2.1 Ponto de Entrada (`main.js`)
- Inicialização da aplicação
- Configuração do Vite
- Importação de estilos e scripts

#### 3.2.2 Serviços (`src/services/`)
- **api.js**: Cliente API centralizado
  - Função helper `apiCall` para todas as chamadas HTTP
  - Tratamento centralizado de erros
  - Autenticação
  - Logs consistentes
  - Endpoints:
    - Spotify: `searchSpotifyTracks`, `addTrackToSpotifyPlaylist`
    - Participants: `getParticipants`, `addParticipant`, `deleteParticipant`, `getParticipantCount`
    - Notifications: `sendNotification`

- **config.js**: Configuração do frontend
  - Estende a configuração centralizada
  - Adapta URLs para ambiente browser
  - Configurações específicas do frontend

### 3.3 Serviços Frontend (Root Level)

#### 3.3.1 Spotify Service (`spotify-service.js`)
- Integração com Spotify API
- Gerenciamento de autenticação
- Operações de playlist
- Busca de músicas

#### 3.3.2 Music Service (`music.js`)
- Lógica de reprodução de música
- Integração com player
- Gerenciamento de estado da música

#### 3.3.3 Scripts Principais (`script.js`)
- Lógica principal da aplicação
- Manipulação do DOM
- Eventos e interações

### 3.4 Backend (`server/`)

#### 3.4.1 Serviço Spotify (`server/services/spotify/`)
- **index.js**: Ponto de entrada do serviço
  - Exporta funções principais
  - Usa configuração centralizada

- **spotify-api.js**: Configuração da API Spotify
  - Inicialização do cliente
  - Gerenciamento de tokens
  - Autenticação
  - Usa configuração centralizada

- **playlist.js**: Gerenciamento de playlists
  - Usa configuração centralizada
  - Integração com Spotify API

### 3.5 Netlify Functions (`netlify/functions/`)
- **api.js**: API principal
  - Endpoints de participantes
  - Gerenciamento de dados
  - Integração com Supabase

- **spotify-callback.js**: Callback do Spotify
  - Processamento de autenticação
  - Gerenciamento de tokens
  - Redirecionamento

- **spotify/**: Endpoints do Spotify
  - `search.js`: Busca de músicas
  - `playlist/add.js`: Adição à playlist

### 3.6 Utilitários (`UTILS/`)
- Funções auxiliares
- Helpers
- Utilitários comuns

### 3.7 Área Administrativa (`admin/`)
- Painel de controle
- Gerenciamento de conteúdo
- Configurações administrativas

## 4. Fluxo de Dados

### 4.1 Busca de Músicas
1. Frontend (`music.js`) → `searchSpotifyTracks(query)`
2. Cliente API (`src/services/api.js`) → `apiCall('/spotify/search')`
3. Netlify Function → Serviço Spotify
4. Spotify API → Resposta
5. Resposta → Frontend → Exibição

### 4.2 Autenticação Spotify
1. Frontend → `getAuthUrl()`
2. Serviço Spotify → URL de autorização
3. Usuário → Spotify → Callback
4. Backend (`spotify-callback.js`) → Token → Frontend

## 5. Configuração e Variáveis de Ambiente

### 5.1 Arquivos de Configuração
- **config.js**: Configurações principais
- **config.template.js**: Template para configuração
- **build-config.js**: Configurações de build
- **vite.config.js**: Configuração do Vite
- **netlify.toml**: Configuração do Netlify

### 5.2 Configuração Centralizada
```javascript
// config/index.js
{
  env: 'development' | 'production',
  urls: {
    base: 'http://localhost:3000/niver2025' | 'https://anacarolinacalazans.com.br/niver2025',
    api: 'http://localhost:3001/api' | 'https://anacarolinacalazans.com.br/niver2025/api',
    callback: 'http://localhost:3000/niver2025/callback' | 'https://anacarolinacalazans.com.br/niver2025/callback'
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    playlistId: process.env.SPOTIFY_PLAYLIST_ID,
    scopes: [...]
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY
  }
}
```

## 6. Melhores Práticas Implementadas

### 6.1 Centralização
- Configuração centralizada em `config/index.js`
- Chamadas de API centralizadas em `src/services/api.js`
- Tratamento de erros padronizado
- Logs consistentes

### 6.2 Segurança
- Validação de variáveis de ambiente
- Tokens gerenciados de forma segura
- CORS configurado adequadamente

### 6.3 Manutenibilidade
- Código DRY (Don't Repeat Yourself)
- Funções pequenas e focadas
- Documentação clara
- Estrutura organizada

## 7. Próximos Passos

1. Implementar sistema de cache para tokens
2. Adicionar testes automatizados
3. Melhorar documentação de endpoints
4. Implementar monitoramento
5. Adicionar CI/CD

## 8. Referências

- [Documentação Spotify API](https://developer.spotify.com/documentation/web-api)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Vite Documentation](https://vitejs.dev/guide/) 