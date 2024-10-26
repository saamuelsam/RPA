// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rota de login
router.post('/login', loginUser);

// Rota protegida de exemplo (somente para admins)
router.get('/admin', verifyToken('admin'), (req, res) => {
  res.json({ message: 'Bem-vindo, Admin!' });
});

// Rota protegida para qualquer usuário autenticado
router.get('/user', verifyToken(), (req, res) => {
  res.json({ message: `Bem-vindo, ${req.authData.username}` });
});

module.exports = router;
