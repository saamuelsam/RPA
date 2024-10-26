// db.js
const { Sequelize } = require('sequelize');

// Configura a conexão com o banco de dados MySQL usando Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nome do banco de dados
  process.env.DB_USER, // Usuário
  process.env.DB_PASSWORD, // Senha
  {
    host: process.env.DB_HOST, // Endereço do servidor de banco de dados
    dialect: 'mysql', // Usando MySQL como dialeto
    logging: false, // Desabilitar logs de SQL (opcional)
  }
);

module.exports = sequelize;
