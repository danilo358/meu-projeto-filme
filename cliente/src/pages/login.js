import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./login.css";
import styled from "styled-components";
import logo from '../assets/logo.png';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
    padding: 2rem 3rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 400px;
    transition: transform 0.3s ease;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Adicione headers explícitos
      const response = await axios.post(
        "http://localhost:8080/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      // Verificação completa da resposta
      if (response.data?.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirecionamento forçado
        window.location.href = "/principal";
      } else {
        setMessage(response.data?.message || "Resposta inválida do servidor");
      }
      
    } catch (error) {
      // Tratamento detalhado de erros
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setMessage("Credenciais inválidas ou usuário não encontrado");
            break;
          case 500:
            setMessage("Erro interno do servidor");
            break;
          default:
            setMessage(`Erro desconhecido: ${error.response.status}`);
        }
      } else {
        setMessage("Não foi possível conectar ao servidor");
      }
      
      // Limpar campos
      setEmail("");
      setPassword("");
    }
  };

  return (
    <Container className="login-container">
      <img src={logo} alt="Logo do site" className="logo" />
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button className="login-button" type="submit">Entrar</button>
      </form>
  
      <p>
        Não tem uma conta? <Link to="/register">Crie uma aqui</Link>
      </p>
    </Container>
  );
};

export default Login;
