import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Al cargar la aplicación, se busca el token en localStorage y se decodifica
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      try {
        const decoded = jwt_decode(savedToken);
        setUser(decoded);
        localStorage.setItem('userRole', decoded.role);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    }
  }, []);

  // Función de login que actualiza el estado y guarda el token y el rol
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', userData.role);
  };

  // Función de logout que limpia el estado y localStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
