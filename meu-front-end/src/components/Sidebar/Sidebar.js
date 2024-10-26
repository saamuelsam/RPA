import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#settings">Configurações</a></li>
        <li><a href="#profile">Perfil</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
