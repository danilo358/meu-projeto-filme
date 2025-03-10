import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: ""
  });
  const [message, setMessage] = useState("");

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!validatePassword(formData.password)) {
        return setMessage("A senha deve conter pelo menos 8 caracteres, incluindo números e caracteres especiais!");
      }
      
      const response = await axios.post("http://localhost:8080/register", formData);
      if (response.data.success) {
        setMessage("Registro realizado com sucesso!");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao registrar usuário");
    }
  };

  return (
    <div className="register-container">
      <h2>Criar Conta</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Registrar</button>
        
        {message && (
          <div className={`message ${message.includes("Erro") ? "error-message" : "success-message"}`}>
            {message}
          </div>
        )}
      </form>

      <p className="register-link">
        Já tem uma conta? <Link to="/">Faça login aqui</Link>
      </p>
    </div>
  );
};

export default Register;