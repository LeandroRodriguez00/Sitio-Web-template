// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Ajusta la URL según tu entorno

export const registerUser = async (userData) => {
  // userData debe ser un objeto con { name, email, password }
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data; // Retorna { result: user, token: <jwt> }
  } catch (error) {
    // Manejo básico de errores
    throw error;
  }
};

export const loginUser = async (credentials) => {
  // credentials debe ser un objeto con { email, password }
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data; // Retorna { result: user, token: <jwt> }
  } catch (error) {
    throw error;
  }
};
