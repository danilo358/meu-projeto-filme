import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          currentPassword: '',
          newPassword: ''
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar perfil");
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validação de campos obrigatórios
      if (!formData.currentPassword) {
        throw new Error("A senha atual é obrigatória para alterações");
      }

      // Enviar todos os campos obrigatoriamente
      const payload = {
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword || null
      };

      // Removemos a atribuição da variável 'response' que não estava sendo usada
      await axios.put('http://localhost:8080/user', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => navigate('/principal'), 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Erro ao atualizar perfil";
      setError(errorMessage);
      
      // Limpar campos sensíveis em caso de erro
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: ''
      }));

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Senha Atual:</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="form-group">
          <label>Nova Senha:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/principal')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;