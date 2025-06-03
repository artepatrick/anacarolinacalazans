# Projeto Niver2025 🎉

Este é um projeto web que integra várias funcionalidades, incluindo uma API, servidor backend, e integração com serviços externos como Spotify.

## 📁 Estrutura do Projeto

```
niver2025/
├── admin/              # Área administrativa do projeto
├── netlify/           # Configurações do Netlify
│   ├── functions/     # Serverless functions
│   │   ├── api.js     # API principal
│   │   └── spotify/   # Serviços do Spotify
│   └── spotify/       # Configurações do Spotify
├── public/            # Arquivos públicos estáticos
├── api.js             # Cliente API para frontend
├── config.js          # Configurações do projeto
├── database.sql       # Schema do banco de dados
├── design.md          # Documentação de design
├── index.html         # Página principal
├── music.js           # Lógica de música e integração Spotify
├── package.json       # Dependências e scripts
├── schema.sql         # Schema do banco de dados
├── script.js          # Scripts principais
├── spotify-api.js     # Integração com Spotify
├── spotify-service.js # Serviços do Spotify
├── styles.css         # Estilos CSS
└── vite.config.js     # Configuração do Vite
```

## 🚀 Funcionalidades Principais

- **API REST**: Implementação de endpoints para gerenciamento de dados
- **Serverless Functions**: API rodando no Netlify Functions
- **Integração com Spotify**: 
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

O projeto utiliza Netlify Functions para gerenciar todas as requisições da API. A estrutura é a seguinte:

1. **API Principal** (`netlify/functions/api.js`):
   - Configuração do CORS
   - Conexão com Supabase
   - Endpoints do Spotify
   - Gerenciamento de participantes

2. **Cliente API** (`api.js`):
   - Comunicação entre frontend e backend
   - Gerenciamento de requisições
   - Tratamento de erros
   - Configuração automática da URL base baseada no ambiente

## 🔐 Autenticação Spotify

O projeto utiliza autenticação OAuth2 com Spotify. O fluxo de autenticação inclui:

1. Redirecionamento para página de autorização do Spotify com escopos específicos
2. Callback para `/niver2025/callback` após autorização
3. Gerenciamento automático de tokens de acesso e refresh
4. Suporte a credenciais do cliente para operações públicas
5. Redirecionamento de volta para a aplicação após autenticação

## 🎵 Funcionalidades do Spotify

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

## 📝 Documentação Adicional

- [Documentação da API Spotify](spotify-api-docs.md)
- [Documentação de Design](design.md)
- [Schema do Banco de Dados](schema.sql)

## 🔧 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm start`: Inicia o servidor em modo produção

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 