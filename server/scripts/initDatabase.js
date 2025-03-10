// server/scripts/initDatabase.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../Users.db", (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao SQLite:", err.message);
  } else {
    console.log("✅ Banco de dados conectado!");
  }
});

// Criação das tabelas
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      birthDate TEXT NOT NULL
    )
  `);

  // Tabela de filmes (NOVA)
  db.run(`
    CREATE TABLE IF NOT EXISTS movies (
      _id INTEGER PRIMARY KEY AUTOINCREMENT,
      tmdbId INTEGER NOT NULL,
      title TEXT NOT NULL,
      poster_path TEXT,
      release_date TEXT,
      vote_average REAL,
      userId INTEGER NOT NULL,
      watched BOOLEAN DEFAULT 0,
      FOREIGN KEY(userId) REFERENCES users(id),
      UNIQUE(tmdbId, userId)
    )`, (err) => {
      if (err) {
        console.error("Erro ao criar tabela de filmes:", err.message);
      } else {
        console.log("Tabela de filmes criada/verificada com sucesso!");
      }
    }
  );
});

// Fecha a conexão
db.close();