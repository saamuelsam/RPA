import React from 'react';
import { Link } from 'react-router-dom';
import './css/AccessDenied.css';

const AccessDenied = () => {
  return (
    <div className="access-denied">
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <Link to="/login" className="back-link">Voltar para o login</Link>
    </div>
  );
};

export default AccessDenied;
