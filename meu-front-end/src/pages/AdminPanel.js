// src/pages/AdminPanel.js
import React from 'react';
import './css/AdminPanel.css'; // Adicionar estilo personalizado

function AdminPanel() {
  return (
    <div className="admin-panel">
      <h2>Painel do Administrador</h2>
      <p>Bem-vindo, Admin! Aqui você pode gerenciar o sistema e configurar permissões.</p>
      
      <div className="admin-actions">
        <button>Gerenciar Usuários</button>
        <button>Configurar Permissões</button>
        <button>Ver Logs do Sistema</button>
        <a href="/create-user"><button>Criar Usuário</button></a>
      </div>
    </div>
  );
}

export default AdminPanel;
