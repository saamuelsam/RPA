const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'secretKey', (err, authData) => {
      if (err) {
        return res.status(403).json({ message: 'Acesso negado. Token inválido.' });
      } else {
        req.authData = authData; // Armazena os dados de autenticação no request
        next();
      }
    });
  } else {
    return res.status(403).json({ message: 'Acesso negado. Token não fornecido.' });
  }
};

// Middleware para verificar se o usuário é admin
const isAdmin = (req, res, next) => {
  if (req.authData && req.authData.role === 'admin') {
    next(); // Se for admin, passa para a próxima função
  } else {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
