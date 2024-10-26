const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const pool = require('./src/config/db');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
app.use(express.json());

// Conectando o banco de dados
pool.getConnection((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados');
});

// Rotas da API
app.use('/auth', authRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
