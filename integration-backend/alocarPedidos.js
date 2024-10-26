// alocarPedidos.js
const pedidoManager = require('./utils/pedidoManager');
const planilhaUtils = require('./utils/planilhaUtils');
const path = require('path');

// Definindo as semanas para comparação
const semanaAtual = 'SEM 5 SETEMBRO';
const semanaPassada = 'SEM 4 SETEMBRO';

// Caminho da planilha local (será baixada do SharePoint)
const caminhoPlanilha = path.join(__dirname, 'assinantes.xlsx'); 

// Função principal para alocar novas entregas
async function alocarNovosPedidos() {
  try {
    // Lê a planilha e obtém os dados a partir do SharePoint
    const dadosPlanilha = await planilhaUtils.lerPlanilha(caminhoPlanilha);

    // Executa o processo de alocação de novas entregas
    const assinantesAtualizados = await pedidoManager.alocarNovasEntregas(semanaAtual, semanaPassada, dadosPlanilha);

    // Atualiza a planilha de assinantes com as novas informações
    planilhaUtils.atualizarPlanilha(caminhoPlanilha, assinantesAtualizados);

    console.log('Processo de alocação de novas entregas concluído!');
  } catch (error) {
    console.error('Erro no processo de alocação de novas entregas:', error);
  }
}

module.exports = {
  alocarNovosPedidos,
};
