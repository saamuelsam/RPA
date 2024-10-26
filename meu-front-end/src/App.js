import React, { useEffect, useContext } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Reports from './pages/Reports';

import Users from './components/users/UserList'
import Login from './components/Login/Login';
import EditorPage from './pages/EditorPage'; // Página de Editor
import ViewerPage from './pages/ViewerPage'; // Página de Viewer
import Overview from './pages/Overview'; // Página de Overview
import AdminPanel from './pages/AdminPanel'; // Página de Admin
import CreateUser from './components/users/CreateUser'; // Página de Criação de Usuário
import RoleBasedRoute from './components/RoleBasedRoute'; // Componente de verificação de papéis
import { AuthContext } from './contexts/authContext'; // Certifique-se de que o caminho esteja correto

function App() {
  const { userRole } = useContext(AuthContext); // Usar useContext para acessar userRole

  const isAuthenticated = () => !!localStorage.getItem('authToken');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const sessionTimeout = setTimeout(() => {
        localStorage.removeItem('authToken');
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = '/login';
      }, 3600000);
      return () => clearTimeout(sessionTimeout);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rota do Dashboard (Acesso para todos os usuários logados) */}
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* Proteger a rota das configurações apenas para 'admin' */}
          <Route
            path="/settings"
            element={
              <RoleBasedRoute requiredRole="admin">
                <Settings />
              </RoleBasedRoute>
            }
          />

          {/* Rota para Editor */}
          <Route
            path="/editor"
            element={
              <RoleBasedRoute requiredRole="editor">
                <EditorPage />
              </RoleBasedRoute>
            }
          />

          {/* Rota para Viewer */}
          <Route
            path="/viewer"
            element={
              <RoleBasedRoute requiredRole="viewer">
                <ViewerPage />
              </RoleBasedRoute>
            }
          />

          {/* Página de Relatórios */}
          <Route
            path="/reports"
            element={
              ['admin', 'editor'].includes(userRole) ? <Reports /> : <Navigate to="/dashboard" />
            }
          />

          {/* Rota dos Usuários apenas para 'admin' */}
          <Route
            path="/users"
            element={
              <RoleBasedRoute requiredRole="admin">
                <Users />
              </RoleBasedRoute>
            }
          />
          {/* Página de Overview (Acesso para admin e viewer) */}
          <Route
            path="/overview"
            element={
              ['admin', 'viewer', 'user'].includes(userRole) ? <Overview /> : <Navigate to="/dashboard" />
            }
          />

          <Route 
            path="/create-user" 
            element={<RoleBasedRoute requiredRole="admin"><CreateUser /></RoleBasedRoute>} />

          {/* Página do AdminPanel */}
          <Route
            path="/admin-panel"
            element={
              ['admin'].includes(userRole) ? <AdminPanel /> : <Navigate to="/admin-panel" />
            }
          />

          {/* Rota padrão para redirecionamento */}
          <Route path="*" element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;