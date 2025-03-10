const jwt = require("jsonwebtoken");
const db = require("./models/database"); // Adicione esta linha
const SECRET_KEY = process.env.SECRET_KEY || "minhaChaveSecreta"; // Use variável de ambiente

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido. Use: Bearer <token>"
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificação mais robusta do token
    const decoded = jwt.verify(token, SECRET_KEY, { ignoreExpiration: false });
    
    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Token inválido: estrutura malformada"
      });
    }

    // Consulta otimizada ao banco de dados
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id, email FROM users WHERE id = ?",
        [decoded.userId],
        (err, row) => {
          if (err) {
            console.error("Erro no banco de dados:", err);
            return reject(new Error("Falha na verificação do usuário"));
          }
          resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado ou conta removida"
      });
    }

    // Adiciona informações do usuário à requisição
    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error("Erro de autenticação:", error.message);

    const response = {
      success: false,
      message: "Falha na autenticação"
    };

    if (error.name === "TokenExpiredError") {
      response.message = "Sessão expirada. Faça login novamente";
    } else if (error.name === "JsonWebTokenError") {
      response.message = "Token inválido ou manipulado";
    }

    res.status(401).json(response);
  }
};

module.exports = authenticate;