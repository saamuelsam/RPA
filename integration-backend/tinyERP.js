const axios = require('axios');
const pedidoManager = require('./utils/pedidoManager');
const planilhaUtils = require('./utils/planilhaUtils');
const path = require('path');
const dotenv = require('dotenv');
const { baixarArquivoDoSharePoint } = require('./services/getSharePointContent'); // Certifique-se de importar a função correta

// Configuração das variáveis de ambiente
dotenv.config();

const TINY_ERP_API_KEY = process.env.TINY_ERP_API_KEY; // Pega a chave da API do Tiny ERP de .env
const baseUrl = 'https://api.tiny.com.br/api2/pedidos.pesquisa.php'; // URL completa da API

// Definindo as semanas para comparação
const semanaAtual = 'SEM 5 SETEMBRO';
const semanaPassada = 'SEM 4 SETEMBRO';

// Caminho local para salvar a planilha após o download
const caminhoPlanilha = path.join(__dirname, 'assinantes.xlsx');

// Função para buscar pedidos no Tiny ERP
async function buscarPedidos(dataEmissao) {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        token: TINY_ERP_API_KEY,
        formato: 'json',
        dataEmissao: dataEmissao, // Formato: 'yyyy-mm-dd'
      }
    });

    if (response.data.retorno.status === 'OK') {
      return response.data.retorno.pedidos;
    } else {
      console.error('Erro ao buscar pedidos:', response.data.retorno);
      return [];
    }
  } catch (error) {
    console.error('Erro ao se conectar à API do Tiny ERP:', error);
    return [];
  }
}

// Função principal para alocar novas entregas
async function alocarNovosPedidos() {
  try {
    console.log("Iniciando o processo de download da planilha do SharePoint...");

    // Passo 1: Baixar a planilha do SharePoint
    await baixarArquivoDoSharePoint('assinantes.xlsx', caminhoPlanilha); // Certifique-se de que o nome do arquivo e o caminho estão corretos

    console.log("Download da planilha concluído. Iniciando a leitura...");

    // Passo 2: Lê a planilha e obtém os dados
    const dadosPlanilha = planilhaUtils.lerPlanilha(caminhoPlanilha);
    console.log("Leitura da planilha concluída. Iniciando alocação de novas entregas...");

    // Passo 3: Executa o processo de alocação de novas entregas
    const assinantesAtualizados = await pedidoManager.alocarNovasEntregas(semanaAtual, semanaPassada, dadosPlanilha);

    console.log("Processo de alocação concluído. Atualizando a planilha local...");

    // Passo 4: Atualiza a planilha de assinantes com as novas informações
    planilhaUtils.atualizarPlanilha(caminhoPlanilha, assinantesAtualizados);

    console.log('Processo de alocação de novas entregas concluído!');
  } catch (error) {
    console.error('Erro no processo de alocação de novas entregas:', error);
  }
}

// Exportar as funções corretamente
module.exports = {
  buscarPedidos,
  alocarNovosPedidos,
};
