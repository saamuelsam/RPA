const { buscarPedidos } = require('../config/tinyERP');
const { savePedido } = require('../services/db');

// Função para sincronizar e processar pedidos
async function syncPedidos(dataEmissao) {
    const pedidos = await buscarPedidos(dataEmissao);

    if (pedidos.length === 0) {
        console.log('Nenhum pedido encontrado.');
        return;
    }

    for (const pedido of pedidos) {
        console.log(`Processando pedido: ${pedido.numero}`);

        // Aqui salvamos o pedido no banco de dados
        try {
            await savePedido({
                numero: pedido.numero,
                cliente: pedido.cliente.nome,
                total: pedido.total,
                dataEmissao: pedido.dataEmissao,
                status: pedido.status
            });
            console.log(`Pedido ${pedido.numero} salvo com sucesso.`);
        } catch (error) {
            console.error(`Erro ao salvar o pedido ${pedido.numero}:`, error);
        }
    }

    console.log('Sincronização de pedidos concluída.');
}

module.exports = {
    syncPedidos,
};
