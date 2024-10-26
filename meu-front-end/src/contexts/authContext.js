// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrigir a importação de jwtDecode

// Cria o contexto de autenticação
export const AuthContext = createContext();

// Componente provedor do contexto
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Função para definir o token de autenticação e o papel do usuário
  const setAuthData = (token) => {
    setAuthToken(token);
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decodifica o token JWT
        setUserRole(decodedToken.role); // Define o papel do usuário com base no token
      } catch (error) {
        console.error('Erro ao decodificar o token JWT:', error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  };

  // Verifica o localStorage para ver se há um token ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthData(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, userRole, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};