const axios = require('axios');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const mysql = require('mysql2/promise');
const log = require('../utils/logger');

// Configurações do banco de dados
const pool = mysql.createPool({
  host: '127.0.0.1', // Endereço do MySQL
  user: 'root', // Seu usuário MySQL
  password: 'Samuel3025*', // Sua senha MySQL
  database: 'meu_banco', // Seu banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// URL de download do arquivo "ASSINANTES - GURU.xlsx"
const downloadUrl = 'https://organicosdafatima.sharepoint.com/sites/Diretoria/_layouts/15/download.aspx?UniqueId=e77eef3e-6096-4396-933f-b678312834cd&Translate=false&tempauth=v1.eyJzaXRlaWQiOiIzYTgwNjg5YS04Y2UwLTQ1NzctYmY3Yi1lZTQzODEwOTdkYzEiLCJhcHBfZGlzcGxheW5hbWUiOiJPcmdhbmljb3NEYUZhdGltYSBTaGFyZVBvaW50IEludGVncmF0aW9uIiwiYXVkIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwL29yZ2FuaWNvc2RhZmF0aW1hLnNoYXJlcG9pbnQuY29tQDc0Y2EzNmNkLThjZGItNDY0Ny1iNDZkLTAzMDQyNjgwODI5YyIsImV4cCI6IjE3MjcyODg0NTQifQ.CgoKBHNuaWQSAjY0EgsIpLvnnI7krj0QBRoMNDAuMTI2LjQ1LjI2KixGSG5WZHZMUElmMkNjUnluaWRvQkEyVFE0NUtlSGFZRC9RUTQ1Wk11UUJRPTCQATgBQhChU8YBaCAAYJD019F1UFYmShBoYXNoZWRwcm9vZnRva2VuegExugG6AW15YXBwZm9sZGVyLndyaXRlIHNlbGVjdGVkc2l0ZXMgZmlsZXMuc2VsZWN0ZWRvcGVyYXRpb25zIGFsbHNpdGVzLnJlYWQgYWxsc2l0ZXMud3JpdGUgYWxsc2l0ZXMubWFuYWdlIGFsbGZpbGVzLndyaXRlIGFsbGZpbGVzLnJlYWQgYWxsc2l0ZXMuZnVsbGNvbnRyb2wgYWxscHJvZmlsZXMud3JpdGUgYWxscHJvZmlsZXMucmVhZMIBSTc4ZDRhOGEyLThkYzgtNDM0Ni1hMGM1LWRlM2NhMWZhN2Q1ZUA3NGNhMzZjZC04Y2RiLTQ2NDctYjQ2ZC0wMzA0MjY4MDgyOWPIAQE.uZj-shVJ1tWO8rDE-mlRGc51uDE-5b8o5il2HmFpTEA&ApiVersion=2.0';

// Função para baixar o arquivo Excel
async function downloadArquivo() {
  try {
    const response = await axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'arraybuffer', // Recebe o arquivo como binário
    });

    const filePath = path.resolve(__dirname, 'ASSINANTES_GURU.xlsx');
    fs.writeFileSync(filePath, response.data);

    log.info('Arquivo baixado com sucesso:', filePath);
    return filePath;
  } catch (error) {
    log.error('Erro ao baixar o arquivo:', error.message);
    throw error; // Lança o erro para ser tratado pela função chamadora
  }
}

// Função para processar os dados do Excel
// Função para processar os dados do arquivo Excel
async function processarArquivoExcel(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Pega a primeira planilha
    const sheet = workbook.Sheets[sheetName];

    // Converte a planilha para JSON sem cabeçalho, pegando os valores diretamente
    const dados = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // Usar 'header: 1' para pegar a primeira linha como valores
    
    // Verifica se há linhas com conteúdo
    if (dados.length === 0) {
      console.error('Erro: A planilha parece estar vazia ou com conteúdo não legível.');
      return;
    }

    // Log dos dados brutos para inspecionar
    console.log('Dados brutos da planilha:', JSON.stringify(dados, null, 2));

    // Supondo que "CLIENTE" está na coluna 0 e "PRODUTO" está na coluna 2, e as linhas de dados começam na linha 2
    const dadosFiltrados = dados.slice(1).map(row => ({
      cliente: row[0],  // Coluna 0 para CLIENTE
      produto: row[2],  // Coluna 2 para PRODUTO
      // Adicione outras colunas que forem necessárias
    }));

    // Verifica se há dados válidos após o cabeçalho
    if (dadosFiltrados.length === 0) {
      console.error('Erro: Não foram encontrados dados válidos na planilha após o cabeçalho.');
      return;
    }

    // Log dos dados filtrados
    log.info('Dados processados do arquivo:', JSON.stringify(dadosFiltrados, null, 2));

    // Insere os dados no banco de dados
    await inserirNoBanco(dadosFiltrados);
  } catch (error) {
    log.error('Erro ao processar o arquivo Excel:', error.message);
  }
}


// Função para inserir os dados no banco de dados
async function inserirNoBanco(dados) {
  const query = `
    INSERT INTO assinantes (cliente, produto)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE 
      cliente = VALUES(cliente), 
      produto = VALUES(produto);
  `;

  try {
    for (const row of dados) {
      const { cliente, produto } = row;

      // Verificação antes de inserir
      if (!cliente || !produto) {
        log.error(`Dados inválidos: Cliente: ${cliente}, Produto: ${produto}`);
        continue; // Pula para o próximo
      }

      const values = [cliente, produto];

      const [result] = await pool.execute(query, values);
      log.info(`Assinante inserido/atualizado: ${cliente}, ID: ${result.insertId}`);
    }
  } catch (error) {
    log.error('Erro ao inserir dados no banco:', error.message);
  }
}

// Função principal para executar o processo completo
async function executarProcesso() {
  try {
    // Baixa o arquivo Excel
    const filePath = await downloadArquivo();

    // Processa o arquivo e insere os dados no banco
    await processarArquivoExcel(filePath);

    log.info('Processo concluído com sucesso.');
  } catch (error) {
    log.error('Erro no processo completo:', error.message);
  }
}

// Executa o processo
executarProcesso();
