// src/pages/ViewerPage.js
import React from 'react';
import './css/ViewerPage.css'; // Adicionar estilo personalizado

function ViewerPage() {
  return (
    <div className="viewer-page">
      <h2>Painel do Visualizador</h2>
      <p>Bem-vindo, Visualizador! Aqui você pode ver relatórios e dados do sistema.</p>
      
      <div className="viewer-content">
        <h3>Relatório Mensal</h3>
        <p>Veja aqui os detalhes dos relatórios e informações mais recentes.</p>
      </div>
    </div>
  );
}

export default ViewerPage;
