# Projeto Niver2025 🎉

Este é um projeto web que integra várias funcionalidades, incluindo uma API, servidor backend, e integração com serviços externos como Spotify.

## 📁 Estrutura do Projeto

```
niver2025/
├── admin/              # Área administrativa do projeto
├── assets/            # Recursos estáticos (imagens, etc)
├── dist/              # Arquivos de build
├── public/            # Arquivos públicos estáticos
├── server/            # Servidor backend
├── src/               # Código fonte principal
│   └── services/      # Serviços centralizados
│       └── api.js     # API service centralizado
├── UTILS/             # Utilitários e helpers
├── .netlify/          # Configurações do Netlify
├── netlify/           # Configurações do Netlify
│   └── functions/     # Funções serverless
│       ├── api.js     # API principal
│       └── spotify/   # Endpoints do Spotify
│           ├── search.js
│           └── playlist/
│               └── add.js
├── node_modules/      # Dependências do projeto
├── .gitignore         # Configuração do Git
├── build-config.js    # Configuração de build
├── config.js          # Configurações do projeto
├── config.template.js # Template de configuração
├── database.sql       # Schema do banco de dados
├── design.md          # Documentação de design
├── index.html         # Página principal
├── music.js           # Lógica de música e integração Spotify (frontend)
├── netlify.toml       # Configuração do Netlify
├── package.json       # Dependências e scripts
├── package-lock.json  # Lock file das dependências
├── README.md          # Este arquivo
├── schema.sql         # Schema do banco de dados
├── script.js          # Scripts principais
├── styles.css         # Estilos CSS
└── vite.config.js     # Configuração do Vite
```

## 🚀 Funcionalidades Principais

- **API REST**: Implementação de endpoints para gerenciamento de dados
- **Serverless Functions**: API rodando no Netlify Functions
- **Integração com Spotify**: 
  - Serviço centralizado em `src/services/api.js`
  - Autenticação OAuth2 com gerenciamento automático de tokens
  - Busca avançada de músicas com suporte a paginação
  - Detalhes completos de artistas, álbuns e faixas
  - Recomendações personalizadas baseadas em faixas
  - Gerenciamento de playlists
  - Sistema robusto de tratamento de erros e logs
  - Suporte a credenciais do cliente para operações públicas
- **Interface Administrativa**: Painel de controle para gerenciamento
- **Frontend**: Interface do usuário responsiva e moderna

## 🛠️ Tecnologias Utilizadas

- Node.js
- Netlify Functions
- Vite
- Spotify API
- SQL (Banco de dados)
- Supabase

## ⚙️ Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no Netlify:
   ```
   SPOTIFY_CLIENT_ID=seu_client_id
   SPOTIFY_CLIENT_SECRET=seu_client_secret
   SPOTIFY_REDIRECT_URI=https://anacarolinacalazans.com.br/niver2025/callback
   SPOTIFY_PLAYLIST_ID=id_da_sua_playlist
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_SERVICE_KEY=sua_chave_do_supabase
   ```

4. Para desenvolvimento local:
   ```bash
   # Terminal 1 - Servidor de Desenvolvimento
   cd niver2025
   npm run dev
   ```

## 🌐 Estrutura da API

O projeto utiliza uma arquitetura centralizada para gerenciamento de API:

1. **API Service** (`src/services/api.js`):
   - Serviço centralizado para todas as chamadas de API
   - Gerenciamento de autenticação
   - Tratamento de erros
   - Configuração automática da URL base
   - Funções para Spotify, participantes e notificações

2. **Netlify Functions** (`netlify/functions/`):
   - `api.js`: API principal com endpoints de participantes
   - `spotify/`: Endpoints específicos do Spotify
     - `search.js`: Busca de músicas
     - `playlist/add.js`: Adição de músicas à playlist

3. **Frontend Integration**:
   - `music.js`: Interface do usuário para busca e seleção de músicas
   - Utiliza o serviço centralizado `api.js` para todas as chamadas

## 🔐 Autenticação Spotify

O projeto utiliza autenticação OAuth2 com Spotify. O fluxo de autenticação inclui:

1. Redirecionamento para página de autorização do Spotify com escopos específicos
2. Callback para `/niver2025/callback` após autorização
3. Gerenciamento automático de tokens de acesso e refresh
4. Suporte a credenciais do cliente para operações públicas
5. Redirecionamento de volta para a aplicação após autenticação

## 🎵 Funcionalidades do Spotify

- **Serviço Centralizado**: Toda a lógica do Spotify está em `spotify-service.js`
- **Busca de Músicas**: Busca avançada com suporte a filtros e paginação
- **Detalhes de Artistas**: Informações completas, top tracks e álbuns
- **Gerenciamento de Álbuns**: Detalhes e faixas de álbuns
- **Recomendações**: Sistema de recomendações baseado em faixas semelhantes
- **Playlists**: Adição automática de faixas à playlist do evento
- **Tratamento de Erros**: Sistema robusto de logs e tratamento de erros de autenticação

## 🚀 Deploy

O projeto está configurado para deploy automático no Netlify:

1. **Build**: O Netlify automaticamente executa `npm run build` para gerar os arquivos estáticos
2. **Functions**: As funções serverless são automaticamente deployadas da pasta `netlify/functions`
3. **Redirects**: Configurados para:
   - `/niver2025/api/*` → API endpoints
   - `/niver2025/callback` → Spotify callback
   - `/*` → SPA routes

## 📡 API Serverless no Netlify

O projeto utiliza Netlify Functions para implementar a API serverless, permitindo que backend e frontend coexistam no mesmo repositório. Aqui está como funciona:

### Estrutura da API

```
netlify/
└── functions/
    ├── api.js              # API principal com todos os endpoints
    └── spotify/            # Endpoints do Spotify
        ├── search.js       # Busca de músicas
        └── playlist/
            └── add.js      # Adiciona música à playlist
```

### Configuração do Netlify

1. **netlify.toml**: Configuração principal do projeto
   ```toml
   [build]
     command = "npm run build"
     functions = "netlify/functions"
     publish = "dist"

   [[redirects]]
     from = "/niver2025/api/*"
     to = "/.netlify/functions/api/:splat"
     status = 200

   [[redirects]]
     from = "/niver2025/callback"
     to = "/.netlify/functions/spotify-callback"
     status = 200
   ```

2. **Variáveis de Ambiente**: Configure no painel do Netlify:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REDIRECT_URI`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`

### Desenvolvimento Local

1. Instale o Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Inicie o ambiente de desenvolvimento:
   ```bash
   netlify dev
   ```
   Isso iniciará tanto o servidor de desenvolvimento do frontend quanto as funções serverless localmente.

### Endpoints da API

A API do Spotify (`netlify/functions/spotify/`) gerencia os seguintes endpoints:

- `GET /niver2025/api/spotify/search`: Busca de músicas
- `POST /niver2025/api/spotify/playlist/add`: Adiciona música à playlist

A API principal (`api.js`) gerencia:
- `GET /niver2025/api/participants`: Lista participantes
- `POST /niver2025/api/participants`: Adiciona participante
- `GET /niver2025/api/participants/count`: Conta total de participantes

### Segurança e CORS

- CORS configurado para permitir requisições do domínio principal
- Autenticação OAuth2 para endpoints do Spotify
- Tokens armazenados de forma segura
- Validação de entrada em todos os endpoints

### Monitoramento

- Logs automáticos no painel do Netlify
- Métricas de performance disponíveis
- Alertas configuráveis para erros

## 📝 Documentação Adicional

- [Documentação da API Spotify](spotify-api-docs.md)
- [Documentação de Design](design.md)
- [Schema do Banco de Dados](schema.sql)

## 🔧 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run build:prod`: Gera build de produção com funções serverless
- `npm start`: Inicia o servidor em modo produção
- `npm run netlify:dev`: Inicia o ambiente Netlify localmente
- `npm run netlify:deploy`: Faz deploy para produção

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request