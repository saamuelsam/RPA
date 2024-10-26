// Definição de permissões baseadas em papéis
const rolePermissions = {
  admin: ['view_dashboard', 'view_reports', 'manage_users', 'view_settings'],
  editor: ['view_dashboard', 'view_reports'],
  viewer: ['view_dashboard'],
};

// Função para verificar permissões
export const hasPermission = (userRole, permission) => {
  if (!userRole || !rolePermissions[userRole]) return false;
  return rolePermissions[userRole].includes(permission);
};

// Função para obter permissões por papel
export const getPermissions = (userRole) => {
  return rolePermissions[userRole] || [];
};
