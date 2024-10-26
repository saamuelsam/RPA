import React from 'react';
import { hasPermission } from '../utils/permissions';

const PermissionWrapper = ({ userRole, requiredPermission, children }) => {
  // Verificar se o usuário tem a permissão necessária
  if (!hasPermission(userRole, requiredPermission)) {
    return null; // Não renderiza o componente se não tiver permissão
  }

  // Renderiza os filhos se o usuário tiver a permissão
  return <>{children}</>;
};

export default PermissionWrapper;
