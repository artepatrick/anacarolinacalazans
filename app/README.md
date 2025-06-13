# Projeto Niver2025 🎉

Este é um projeto web que integra várias funcionalidades, incluindo uma API, servidor backend, e integração com serviços externos como Spotify.

## 📁 Estrutura do Projeto

```
niver2025/
├── admin/              # Área administrativa do projeto
├── netlify/           # Configurações do Netlify
│   └── functions/     # Netlify Serverless Functions
│       ├── api.js     # API principal
│       ├── spotify-callback.js # Callback do Spotify
│       └── spotify/   # Serviços do Spotify
│           ├── config.js
│           └── service.js
├── node_modules/      # Dependências do projeto
├── public/            # Arquivos públicos estáticos
├── server/            # Servidor backend
├── api.js             # Configuração principal da API
├── config.js          # Configurações do projeto
├── database.sql       # Schema do banco de dados
├── design.md          # Documentação de design
├── index.html         # Página principal
├── music.js           # Lógica de música e integração Spotify
├── netlify.toml       # Configuração do Netlify
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
- **Integração com Spotify**: 
  - Autenticação OAuth2
  - Busca de músicas
  - Adição de músicas à playlist
  - Gerenciamento de tokens
- **Interface Administrativa**: Painel de controle para gerenciamento
- **Servidor Backend**: Processamento de requisições e lógica de negócio
- **Frontend**: Interface do usuário responsiva e moderna

## 🛠️ Tecnologias Utilizadas

- Node.js
- Vite
- Netlify
- Netlify Functions (Serverless)
- Spotify API
- SQL (Banco de dados)
- Express.js
- Supabase

## ⚙️ Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente (baseado em config.template.js):
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
   npm run dev
   ```

## 🌐 Deploy no Netlify

1. Configure as variáveis de ambiente no Netlify:
   - Acesse o dashboard do Netlify
   - Vá em Site settings > Environment variables
   - Adicione todas as variáveis de ambiente necessárias

2. Estrutura das Netlify Functions:
   - `/netlify/functions/api.js`: API principal
   - `/netlify/functions/spotify-callback.js`: Callback do Spotify
   - `/netlify/functions/spotify/`: Serviços do Spotify
     - `config.js`: Configuração do Spotify
     - `service.js`: Serviços do Spotify

3. Deploy:
   ```bash
   git add .
   git commit -m "Seu commit message"
   git push
   ```

## 🔐 Autenticação Spotify

O projeto utiliza autenticação OAuth2 com Spotify. O fluxo de autenticação inclui:

1. Redirecionamento para página de autorização do Spotify
2. Callback para `/niver2025/callback` após autorização
3. Gerenciamento automático de tokens de acesso e refresh
4. Redirecionamento de volta para a aplicação após autenticação

## 📝 Documentação Adicional

- [Documentação da API Spotify](spotify-api-docs.md)
- [Documentação de Design](design.md)
- [Schema do Banco de Dados](schema.sql)

## 🔧 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run deploy`: Faz deploy para o Netlify

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 