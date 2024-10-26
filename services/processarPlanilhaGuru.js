const axios = require('axios');
const XLSX = require('xlsx');
const { savePedido } = require('./db'); // Certifique-se que o caminho para db.js está correto
const log = require('../utils/logger');

// Função para processar a planilha
async function processarPlanilhaGuru(arquivoGuruUrl) {
  try {
    // Baixar e ler o arquivo da planilha GURU
    log.info(`Baixando planilha da URL: ${arquivoGuruUrl}`);
    const response = await axios.get(arquivoGuruUrl, { responseType: 'arraybuffer' });
    
    // Lê o conteúdo da planilha com XLSX
    const workbook = XLSX.read(response.data, { type: 'buffer' });

    // Assume que o primeiro sheet é o correto
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Converte a planilha em JSON
    const dados = XLSX.utils.sheet_to_json(sheet);

    // Processa cada linha da planilha e salva no banco de dados
    for (const linha of dados) {
      const pedido = {
        numero: linha['Número do Pedido'], // Substitua pelos nomes das colunas corretos da sua planilha
        cliente: linha['Nome do Cliente'],
        total: linha['Valor Total'],
        dataEmissao: new Date(linha['Data de Emissão']).toISOString().slice(0, 10), // Ajuste conforme os nomes das colunas
        status: linha['Status do Pedido'] || 'Novo' // Define status padrão se ausente
      };

      // Salva o pedido no banco de dados
      await savePedido(pedido);
    }

    log.info('Planilha GURU processada e dados salvos com sucesso.');
  } catch (error) {
    log.error(`Erro ao processar a planilha: ${error.message}`);
  }
}

module.exports = {
  processarPlanilhaGuru,
};
