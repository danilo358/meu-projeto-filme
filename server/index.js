require("dotenv").config(); // 🔹 Carregar as variáveis do .env primeiro
const express = require("express");
const cors = require("cors");
const connectDB = require("./models/database");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

const User = require("./models/User");
const Movie = require("./models/Movies");
const bcrypt = require("bcryptjs");


// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
});

// Middleware de autenticação com MongoDB
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do header

    if (!token) {
      return res.status(401).json({ success: false, message: "Token não fornecido" });
    }

    // Decodifica o token e verifica se é válido
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Busca o usuário no banco de dados pelo ID armazenado no token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Usuário não encontrado" });
    }

    req.userId = user._id; // Armazena o ID do usuário para as próximas requisições
    next(); // Passa para a próxima função na rota

  } catch (error) {
    console.error("Erro de autenticação:", error.message);
    return res.status(401).json({ success: false, message: "Autenticação falhou: Token inválido ou expirado" });
  }
};


// 📌 Rota de Registro (Cadastro de Usuário)
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, birthDate } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email já cadastrado" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no MongoDB
    const newUser = new User({ name, email, password: hashedPassword, birthDate });
    await newUser.save();

    res.json({ success: true, message: "Usuário registrado com sucesso!" });

  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// 📌 Rota de Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email e senha são obrigatórios" });
    }

    // Buscar usuário no MongoDB
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }

    // Geração do token JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "2h" });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// 📌 Rota para Obter os Dados do Usuário
app.get("/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado" });
    }

    res.json({ success: true, user });

  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// 📌 Rota para Atualizar os Dados do Usuário
app.put("/user", authenticate, async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    // Verifica senha atual antes de atualizar
    if (currentPassword && !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ success: false, message: "Senha atual incorreta" });
    }

    // Atualizar senha se fornecida
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ success: true, message: "Perfil atualizado com sucesso!" });

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// 📌 Rota para Excluir Conta do Usuário
app.delete("/user", authenticate, async (req, res) => {
  try {
    await Movie.deleteMany({ userId: req.userId });
    await User.findByIdAndDelete(req.userId);

    res.json({ success: true, message: "Conta excluída com sucesso!" });

  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// 📌 Rota para Listar os Filmes do Usuário
app.get("/api/movies", authenticate, async (req, res) => {
  try {
    const movies = await Movie.find({ userId: req.userId });
    res.json({ success: true, data: movies });

  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar filmes" });
  }
});

// 📌 Rota para Adicionar um Filme à Lista
app.post("/api/movies", authenticate, async (req, res) => {
  try {
    const { tmdbId, title, poster_path, release_date, vote_average } = req.body;

    if (!tmdbId || !title) {
      return res.status(400).json({ success: false, message: "Dados do filme inválidos" });
    }

    const movie = new Movie({
      tmdbId, title, poster_path, release_date, vote_average, userId: req.userId, watched: false
    });

    await movie.save();
    res.json({ success: true, message: "Filme adicionado com sucesso!", movie });

  } catch (error) {
    console.error("Erro ao adicionar filme:", error);
    res.status(500).json({ success: false, message: "Erro ao adicionar filme" });
  }
});


//Para colocar asssitido

app.put("/api/movies/:id", authenticate, async (req, res) => {
  try {
    const { watched } = req.body;

    if (typeof watched !== "boolean") {
      return res.status(400).json({ success: false, message: "Valor inválido para 'watched'" });
    }

    const movie = await Movie.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Filtra pelo ID do filme e usuário
      { watched }, // Atualiza o status de "assistido"
      { new: true } // Retorna o novo valor atualizado
    );

    if (!movie) {
      return res.status(404).json({ success: false, message: "Filme não encontrado" });
    }

    res.json({ success: true, message: "Status atualizado com sucesso!", movie });

  } catch (error) {
    console.error("Erro ao atualizar filme:", error);
    res.status(500).json({ success: false, message: "Erro ao atualizar filme" });
  }
});


//para remover da lista

app.delete("/api/movies/:id", authenticate, async (req, res) => {
  try {
    const movie = await Movie.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!movie) {
      return res.status(404).json({ success: false, message: "Filme não encontrado" });
    }

    res.json({ success: true, message: "Filme removido com sucesso!" });

  } catch (error) {
    console.error("Erro ao remover filme:", error);
    res.status(500).json({ success: false, message: "Erro ao remover filme" });
  }
});
