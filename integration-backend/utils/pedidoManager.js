const tinyERP = require('../tinyERP');
const planilhaUtils = require('./planilhaUtils');
const path = require('path');

const CAMINHO_PLANILHA = path.join(__dirname, '..', 'assinantes.xlsx');

// Função para calcular a nova data de entrega
function calcularNovaDataEntrega(diaEntrega) {
  const hoje = new Date();
  const novaData = new Date(hoje.setDate(hoje.getDate() + (diaEntrega - hoje.getDay())));
  return novaData.toISOString().split('T')[0]; // Retorna a data no formato 'YYYY-MM-DD'
}

async function alocarNovasEntregas(semanaAtual, semanaPassada, dadosClientes) {
  try {
    console.log(`Iniciando a alocação para a semana ${semanaAtual} com referência na semana passada (${semanaPassada})`);

    // Passo 1: Buscar pedidos entregues no Tiny ERP na semana passada
    const pedidosEntregues = await tinyERP.buscarPedidos(semanaPassada);
    console.log(`Pedidos entregues na semana passada: ${pedidosEntregues.length}`);

    // Passo 2: Verificar quais clientes tiveram entregas na semana passada e precisam de novas entregas
    const novasEntregas = dadosClientes.filter(cliente => {
      const ultimaEntrega = planilhaUtils.verificarUltimaEntrega(dadosClientes, cliente.idCliente);
      console.log(`Cliente: ${cliente.nome} | Última entrega encontrada: ${ultimaEntrega}`);
      
      return ultimaEntrega && new Date(ultimaEntrega) <= new Date(semanaPassada);
    });

    console.log(`Novas entregas identificadas: ${novasEntregas.length}`);

    // Passo 3: Atualizar os pedidos no Tiny ERP com a nova data de entrega e observação
    const assinantesAtualizados = [];
    for (const entrega of novasEntregas) {
      const pedidoEncontrado = pedidosEntregues.find(
        (pedido) => pedido.cliente === entrega.nome && pedido.status === 'Entregue'
      );

      if (pedidoEncontrado) {
        const novaDataEntrega = calcularNovaDataEntrega(entrega.diaEntrega);
        const observacao = entrega.observacao || 'Entrega agendada automaticamente';

        await tinyERP.atualizarPedido(pedidoEncontrado.id, novaDataEntrega, observacao);
        console.log(`Pedido para ${entrega.nome} atualizado com nova data de entrega: ${novaDataEntrega}`);
        assinantesAtualizados.push({
          ...entrega,
          ultimaEntrega: novaDataEntrega
        });
      } else {
        console.log(`Pedido para ${entrega.nome} não encontrado ou já atualizado.`);
      }
    }

    return assinantesAtualizados; // Retornar os assinantes atualizados
  } catch (error) {
    console.error('Erro no processo de alocação de entregas:', error);
    return [];
  }
}

module.exports = {
  alocarNovasEntregas,
};
