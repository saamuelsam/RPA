// src/pages/EditorPage.js
import React from 'react';
import './css/EditorPage.css'; // Adicionar estilo personalizado

function EditorPage() {
  return (
    <div className="editor-page">
      <h2>Painel do Editor</h2>
      <p>Bem-vindo, Editor! Aqui você pode editar relatórios e gerenciar conteúdos.</p>
      
      <div className="editor-actions">
        <button>Criar Novo Relatório</button>
        <button>Editar Relatório Existente</button>
      </div>
    </div>
  );
}

export default EditorPage;
  