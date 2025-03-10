// server/scripts/initDatabase.js
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../Users.db", (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao SQLite:", err.message);
  } else {
    console.log("✅ Banco de dados conectado!");
  }
});


db.run(`
    DROP TABLE movies;
    )`, (err) => {
      if (err) {
        console.error("Erro ao criar tabela de filmes:", err.message);
      } else {
        console.log("Tabela de filmes criada/verificada com sucesso!");
      }
    }
  );