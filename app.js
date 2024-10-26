require('dotenv').config(); // Carregar variáveis de ambiente
const cron = require('node-cron');
const log = require('./utils/logger'); // Certifique-se de importar o logger corretamente
const { buscarPedidos } = require('./integration-backend/tinyERP');
const obterDadosDoSharePoint = require('./obterDadosDoSharePoint'); // Função que busca dados no SharePoint
const { savePedido } = require('./services/db'); // Função para salvar pedidos no banco de dados
const axios = require('axios'); // Para fazer requisições HTTP
const XLSX = require('xlsx'); // Para ler a planilha XLSX

// Função para obter a data atual no formato 'yyyy-mm-dd'
function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
  const dia = hoje.getDate().toString().padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

async function processarPedidos(data) {
  const dataAtual = data || obterDataAtual(); // Use a data fornecida ou a data atual
  log.info(`Iniciando sincronização de pedidos para a data: ${dataAtual}.`);

  try {
    const pedidos = await buscarPedidos(dataAtual);
    log.info(`Pedidos recebidos para a data ${dataAtual}: ${JSON.stringify(pedidos)}`);

    if (!pedidos || pedidos.length === 0) {
      log.info(`Nenhum pedido encontrado para a data atual: ${dataAtual}.`);
      return;
    }

    // Log para cada pedido recebido
    for (const pedido of pedidos) {
      log.info(`Pedido recebido: ${JSON.stringify(pedido)}`);
      await savePedido(pedido.pedido); // Salva o pedido no banco
    }

    log.info('Sincronização de pedidos concluída com sucesso.');
  } catch (error) {
    log.error(`Erro ao sincronizar pedidos: ${error.message}`);
  }
}

// Função para processar a planilha e salvar os dados no banco de dados
async function processarPlanilha(arquivoGuruUrl) {
  try {
    // Baixar e ler o arquivo da planilha GURU
    const response = await axios.get(arquivoGuruUrl, { responseType: 'arraybuffer' });
    const workbook = XLSX.read(response.data, { type: 'buffer' });

    // Assume que o primeiro sheet é o correto
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Converte a planilha em JSON
    const dados = XLSX.utils.sheet_to_json(sheet);

    // Processa cada linha da planilha e salva no banco de dados
    for (const linha of dados) {
      // Usa o campo 'data_pedido' como data de emissão, já que 'dataEmissao' parece não estar presente
      const dataEmissao = linha['data_pedido'];

      if (!dataEmissao) {
        log.error('Data não encontrada:', linha);
        continue; // Pula esse pedido se não houver data de emissão
      }

      const pedido = {
        numero: linha['Número do Pedido'],
        cliente: linha['Nome do Cliente'],
        total: linha['Valor Total'],
        dataEmissao: new Date(dataEmissao).toISOString().slice(0, 10), // Converte para formato yyyy-mm-dd
        status: linha['Status do Pedido'] || 'Novo' // Define status padrão se ausente
      };

      await savePedido(pedido);
    }

    log.info('Planilha GURU processada e dados salvos com sucesso.');
  } catch (error) {
    log.error(`Erro ao processar a planilha: ${error.message}`);
  }
}

// Agendar o cron job para rodar diariamente às 02:00 AM
cron.schedule('0 2 * * *', async () => {
  log.info('Iniciando sincronização de pedidos.');

  try {
    await processarPedidos(); // Use a função processarPedidos com a data atual
    log.info('Sincronização de pedidos concluída com sucesso.');
  } catch (error) {
    log.error(`Erro ao sincronizar pedidos: ${error.message}`);
  }

  try {
    log.info('Iniciando a obtenção do arquivo do SharePoint...');

    const arquivos = await obterDadosDoSharePoint(); // Executa a função que obtém os dados do SharePoint

    if (Array.isArray(arquivos.value)) {
      const arquivoGuru = arquivos.value.find(arquivo => arquivo.name === 'ASSINANTES - GURU.xlsx');

      if (arquivoGuru) {
        log.info(`Arquivo GURU encontrado: ${JSON.stringify(arquivoGuru)}`);
        log.info(`URL para download do arquivo GURU: ${arquivoGuru['@microsoft.graph.downloadUrl']}`);
        await processarPlanilha(arquivoGuru['@microsoft.graph.downloadUrl']);
      } else {
        log.error('Arquivo GURU não encontrado.');
      }
    } else {
      log.error('O retorno não é uma lista de arquivos. Verifique a resposta.');
      log.info(`Conteúdo da resposta: ${JSON.stringify(arquivos)}`);
    }

    log.info('Arquivos obtidos com sucesso.');
  } catch (error) {
    log.error(`Erro ao obter arquivo do SharePoint: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
  }

  log.info('Processos concluídos.');
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

console.log('Cron job configurado para rodar diariamente às 02:00 AM');

// Executa as funções manualmente para testar sem o cron job
(async () => {
  log.info('Iniciando sincronização manual de pedidos para testes.');

  try {
    await processarPedidos(); // Executa a função de pedidos
    log.info('Sincronização de pedidos concluída com sucesso (execução manual).');
  } catch (error) {
    log.error(`Erro ao sincronizar pedidos (execução manual): ${error.message}`);
  }

  try {
    log.info('Iniciando a obtenção manual do arquivo do SharePoint para testes...');

    const arquivos = await obterDadosDoSharePoint(); // Executa a função do SharePoint

    if (Array.isArray(arquivos.value)) {
      const arquivoGuru = arquivos.value.find(arquivo => arquivo.name === 'ASSINANTES - GURU.xlsx');

      if (arquivoGuru) {
        log.info(`Arquivo GURU encontrado: ${JSON.stringify(arquivoGuru)}`);
        log.info(`URL para download do arquivo GURU: ${arquivoGuru['@microsoft.graph.downloadUrl']}`);
        await processarPlanilha(arquivoGuru['@microsoft.graph.downloadUrl']);
      } else {
        log.error('Arquivo GURU não encontrado.');
      }
    } else {
      log.error('O retorno não é uma lista de arquivos. Verifique a resposta.');
      log.info(`Conteúdo da resposta: ${JSON.stringify(arquivos)}`);
    }

    log.info('Arquivos obtidos com sucesso.');
  } catch (error) {
    log.error(`Erro ao obter arquivo do SharePoint (execução manual): ${error.response ? JSON.stringify(error.response.data) : error.message}`);
  }

  log.info('Processo manual concluído.');
})();
