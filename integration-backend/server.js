// server.js
import express from 'express';
import dotenv from 'dotenv';
import { verificarConexao, baixarArquivoDoSharePoint } from './services/getSharePointContent.js'; // Importar as funções

dotenv.config();

const app = express();

app.get("/", async (req, res) => {
  res.send("Servidor Express em execução.");
});

// Exemplo de rota para baixar um arquivo do SharePoint
app.get("/baixar/:nomeArquivo", async (req, res) => {
  const nomeArquivo = req.params.nomeArquivo;
  try {
    await baixarArquivoDoSharePoint(nomeArquivo, `./downloads/${nomeArquivo}`);
    res.send(`Arquivo ${nomeArquivo} baixado com sucesso!`);
  } catch (error) {
    res.status(500).send("Erro ao baixar o arquivo.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Verificar a conexão com o SharePoint ao iniciar o servidor
verificarConexao();
