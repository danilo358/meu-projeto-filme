# 📌 Meu Projeto de Filmes

Este projeto é um aplicativo web que permite aos usuários explorar, favoritar e marcar filmes como assistidos, utilizando a API do The Movie Database (TMDB). O projeto é dividido em duas partes:

- **Frontend (`client/`)**: Desenvolvido com React.js.
- **Backend (`server/`)**: Construído com Node.js e Express.

## 🚀 Tecnologias Utilizadas

**Frontend:**

- React.js
- React Router DOM
- Styled Components
- Axios
- Lodash.debounce

**Backend:**

- Node.js
- Express.js
- SQLite (ou outro banco de dados)
- JWT (JSON Web Token) para autenticação
- Bcrypt para hash de senhas

## 🛠️ Como Rodar o Projeto

1. **Clonar o repositório:**

   ```bash
   git clone https://github.com/danilo358/meu-projeto-filmes.git
   cd meu-projeto-filmes
Configurar o Backend (server/):

Acesse a pasta server/ e instale as dependências:

bash
Copiar
Editar
cd server
npm install
Crie um arquivo .env na pasta server e adicione:

ini
Copiar
Editar
SECRET_KEY=minhaChaveSecreta
PORT=8080
MONGO_URI=mongodb+srv://{usuario}:{senha}@trackdb.w7f2c.mongodb.net/?retryWrites=true&w=majority&appName=TrackDB
Inicie o servidor:

bash
Copiar
Editar
npm run dev
📌 O backend rodará na porta 8080.

Configurar o Frontend (client/):

Acesse a pasta client/ e instale as dependências:

bash
Copiar
Editar
cd ../client
npm install
Crie um arquivo .env na pasta client e adicione:

ini
Copiar
Editar
REACT_APP_TMDB_API_KEY=SUA_API_KEY_TMDB
REACT_APP_BACKEND_URL=http://localhost:8080
Inicie o frontend:

bash
Copiar
Editar
npm start
📌 O frontend rodará na porta 3000.

## 📂 Estrutura do Projeto

```bash
meu-projeto-filmes/
├── client/             # Pasta do frontend (React)
│   ├── src/            # Código fonte do React
│   ├── public/         # Arquivos estáticos
│   ├── .env            # Configurações do frontend
│   ├── package.json    # Dependências do frontend
│   └── ...             
│
├── server/             # Pasta do backend (Node.js)
│   ├── models/         # Modelos do banco de dados
│   ├── middlewares/    # Middlewares de autenticação e validação
│   ├── scripts/        # Scripts auxiliares
│   ├── index.js        # Ponto de entrada do servidor
│   ├── .env            # Configurações do backend
│   ├── package.json    # Dependências do backend
│   └── ...             
│
├── .gitignore          # Arquivos e pastas a serem ignorados pelo Git
├── README.md           # Documentação do projeto
└── package.json        # Dependências globais

🎥 Funcionalidades
✅ Explorar Filmes: Buscar e visualizar detalhes dos filmes pela API do TMDB.
✅ Favoritar: Adicionar filmes a uma lista pessoal.
✅ Marcar como Assistido: Registrar filmes que já foram vistos.
✅ Autenticação: Login e registro de usuários.
✅ Paginação: Navegar entre páginas de filmes populares.
👨‍💻 Autor
Feito por @danilo358 🚀# 📌 Meu Projeto de Filmes

Este projeto é um aplicativo web que permite aos usuários explorar, favoritar e marcar filmes como assistidos, utilizando a API do The Movie Database (TMDB). O projeto é dividido em duas partes:

- **Frontend (`client/`)**: Desenvolvido com React.js.
- **Backend (`server/`)**: Construído com Node.js e Express.

## 🚀 Tecnologias Utilizadas

**Frontend:**

- React.js
- React Router DOM
- Styled Components
- Axios
- Lodash.debounce

**Backend:**

- Node.js
- Express.js
- SQLite (ou outro banco de dados)
- JWT (JSON Web Token) para autenticação
- Bcrypt para hash de senhas

## 🛠️ Como Rodar o Projeto

1. **Clonar o repositório:**

   ```bash
   git clone https://github.com/danilo358/meu-projeto-filmes.git
   cd meu-projeto-filmes
Configurar o Backend (server/):

Acesse a pasta server/ e instale as dependências:

bash
Copiar
Editar
cd server
npm install
Crie um arquivo .env na pasta server e adicione:

ini
Copiar
Editar
SECRET_KEY=minhaChaveSecreta
PORT=8080
MONGO_URI=mongodb+srv://{usuario}:{senha}@trackdb.w7f2c.mongodb.net/?retryWrites=true&w=majority&appName=TrackDB
Inicie o servidor:

bash
Copiar
Editar
npm run dev
📌 O backend rodará na porta 8080.

Configurar o Frontend (client/):

Acesse a pasta client/ e instale as dependências:

bash
Copiar
Editar
cd ../client
npm install
Crie um arquivo .env na pasta client e adicione:

ini
Copiar
Editar
REACT_APP_TMDB_API_KEY=SUA_API_KEY_TMDB
REACT_APP_BACKEND_URL=http://localhost:8080
Inicie o frontend:

bash
Copiar
Editar
npm start
📌 O frontend rodará na porta 3000.

📂 Estrutura do Projeto
bash
Copiar
Editar
meu-projeto-filmes/
│-- client/            # Pasta do frontend (React)
│   ├── src/           # Código fonte do React
│   ├── public/        # Arquivos estáticos
│   ├── .env           # Configurações do frontend
│   ├── package.json   # Dependências do frontend
│   └── ...
│
│-- server/            # Pasta do backend (Node.js)
│   ├── models/        # Modelos do banco de dados
│   ├── middlewares/   # Middlewares de autenticação e validação
│   ├── scripts/       # Scripts auxiliares
│   ├── index.js       # Ponto de entrada do servidor
│   ├── .env           # Configurações do backend
│   ├── package.json   # Dependências do backend
│   └── ...
│
│-- .gitignore         # Ignorar arquivos desnecessários
│-- README.md          # Documentação
│-- package.json       # Dependências globais
🎥 Funcionalidades
✅ Explorar Filmes: Buscar e visualizar detalhes dos filmes pela API do TMDB.
✅ Favoritar: Adicionar filmes a uma lista pessoal.
✅ Marcar como Assistido: Registrar filmes que já foram vistos.
✅ Autenticação: Login e registro de usuários.
✅ Paginação: Navegar entre páginas de filmes populares.
👨‍💻 Autor
Feito por @danilo358 🚀
