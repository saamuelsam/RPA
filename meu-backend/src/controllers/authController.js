// backend/controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Chave secreta do JWT
const JWT_SECRET = 'secretKey'; // Para produção, armazene isso no .env

// Função para o login de usuários
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Consulta o usuário no banco de dados
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  // Verifica a senha
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  // Consulta o papel do usuário
  const [roleRows] = await pool.execute('SELECT role_name FROM roles WHERE id = ?', [user.role_id]);
  const role = roleRows[0]?.role_name;

  // Gerar um token JWT com o papel do usuário
  const token = jwt.sign({ username: user.username, role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

module.exports = { loginUser };
