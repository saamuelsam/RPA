import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente que protege rotas com base na autenticação e nos papéis do usuário
function ProtectedRoute({ children, requiredRole }) {
  // Verifica se o usuário está autenticado
  const isAuthenticated = !!localStorage.getItem('authToken');

  // Obtém e decodifica o token para extrair o papel (role)
  const getUserRole = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Decodifica o token para obter o papel do usuário
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.role;
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
      }
    }
    return null;
  };

  // Obtém o papel do usuário
  const userRole = getUserRole();

  // Se o usuário não está autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Se o papel não corresponde ao papel necessário, redireciona para a página de acesso negado ou dashboard
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  // Se o usuário está autenticado e possui as permissões corretas, renderiza o componente filho
  return children;
}

export default ProtectedRoute;
