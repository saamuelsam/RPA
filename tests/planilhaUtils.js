const xlsx = require('xlsx');
const path = require('path');

/**
 * Função para ler a planilha e retornar um objeto estruturado
 */
function lerPlanilha(caminho) {
  const workbook = xlsx.readFileSync(caminho);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  // Estrutura de retorno
  const dadosClientes = {};

  // Percorre cada linha da planilha para montar um objeto estruturado
  jsonData.forEach((linha) => {
    const cliente = linha['cliente'];
    const dia = linha['dia'];
    const produto = linha['produto'];
    const observacao = linha['observação'];

    // Cria um objeto para cada cliente, caso ainda não exista
    if (!dadosClientes[cliente]) {
      dadosClientes[cliente] = {
        dia: dia,
        produto: produto,
        observacao: observacao,
        entregas: {}, // Para armazenar entregas por semana
      };
    }

    // Percorre as colunas que representam semanas (SEM 4 SETEMBRO, SEM 5 SETEMBRO, etc.)
    Object.keys(linha).forEach((coluna) => {
      if (coluna.startsWith('SEM')) {
        dadosClientes[cliente].entregas[coluna] = linha[coluna];
      }
    });
  });

  return dadosClientes;
}

/**
 * Função para verificar a última entrega e determinar se é necessário agendar uma nova
 */
function verificarUltimaEntrega(dadosClientes, semanaAtual, semanaPassada) {
  const agendamentos = [];

  Object.keys(dadosClientes).forEach((cliente) => {
    const entregas = dadosClientes[cliente].entregas;

    if (entregas[semanaPassada] && !entregas[semanaAtual]) {
      // Se houve entrega na semana passada e não há entrega programada para esta semana
      agendamentos.push({
        cliente: cliente,
        dia: dadosClientes[cliente].dia,
        produto: dadosClientes[cliente].produto,
        observacao: dadosClientes[cliente].observacao,
        semana: semanaAtual, // Define a semana para a nova entrega
      });
    }
  });

  return agendamentos;
}

module.exports = { lerPlanilha, verificarUltimaEntrega };