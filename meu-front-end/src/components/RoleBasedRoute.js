import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const RoleBasedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Se não houver token, redireciona para o login
    return <Navigate to="/login" />;
  }

  // Decodifica o token para verificar o papel do usuário
  try {
    const decodedToken = jwtDecode(token);

    if (decodedToken.role !== requiredRole) {
      // Se o papel não corresponder ao esperado, redireciona para a página de acesso negado
      return <Navigate to="/acesso-negado" />;
    }

    // Caso o usuário tenha o papel correto, renderiza o componente filho
    return children;

  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    // Se ocorrer um erro na decodificação, redireciona para o login
    return <Navigate to="/login" />;
  }
};

export default RoleBasedRoute;
