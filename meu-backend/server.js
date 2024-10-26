const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');
const { verifyToken, isAdmin } = require('./src/middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração do Sequelize para MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,         // Nome do banco de dados
  process.env.DB_USER,         // Usuário
  process.env.DB_PASSWORD,     // Senha
  {
    host: process.env.DB_HOST, // Host
    port: process.env.DB_PORT || 3306, // Porta do MySQL (padrão: 3306)
    dialect: 'mysql'           // Dialeto utilizado pelo Sequelize
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

// Sincronização do banco de dados e criação de usuários de exemplo
sequelize.sync({ alter: true }).then(() => {
  User.findOrCreate({ where: { username: 'admin' }, defaults: { password: 'admin', role: 'admin' } });
  User.findOrCreate({ where: { username: 'editor' }, defaults: { password: 'editor', role: 'editor' } });
  User.findOrCreate({ where: { username: 'viewer' }, defaults: { password: 'viewer', role: 'viewer' } });
  User.findOrCreate({ where: { username: 'user' }, defaults: { password: 'user', role: 'user' } });
});

app.use(express.json());
app.use(cors());

// Rota de login com autenticação baseada no banco de dados
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username, password } });
    if (user) {
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

// CRUD de Usuários - Criar um novo usuário
app.post('/api/users', verifyToken, isAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const newUser = await User.create({ username, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// CRUD de Usuários - Atualizar um usuário existente
app.put('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    await User.update({ username, password, role }, { where: { id } });
    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// CRUD de Usuários - Excluir um usuário
app.delete('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await User.destroy({ where: { id } });
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
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