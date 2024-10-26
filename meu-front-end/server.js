const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const { verifyToken, isAdmin } = require('../meu-backend/src/middlewares/authMiddleware'); // Importando do authMiddleware

const app = express();
const PORT = 5000;

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do Sequelize para MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  }
);

// Definição do modelo de usuário com Sequelize
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
});

// Sincronização do banco de dados
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco de dados sincronizado');
});

app.use(express.json());
app.use(cors());

// Função para criar um novo usuário com senha hash
const createUser = async (username, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword, role });
};

// Rota de login com autenticação baseada no banco de dados
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

// CRUD de Usuários - Listar todos os usuários
app.get('/api/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// CRUD de Usuários - Criar um novo usuário com senha hash
app.post('/api/users', verifyToken, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota protegida para todos os usuários autenticados
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Rota protegida acessada com sucesso!', user: req.authData });
});

// Rota apenas para admin
app.get('/api/admin', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Bem-vindo ao painel administrativo, Admin!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
