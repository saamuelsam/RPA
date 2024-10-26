const cron = require('node-cron');
const { buscarPedidos } = require('../config/tinyERP'); // Caminho para o arquivo que contém a função de busca

// Função para obter a data atual no formato 'yyyy-mm-dd'
function obterDataAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Meses começam do zero, então adicionamos 1
    const dia = hoje.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda se for necessário
    return `${ano}-${mes}-${dia}`;
}

// Função para buscar pedidos com a data atual
async function buscarPedidosDoDia() {
    const dataAtual = obterDataAtual();
    const pedidos = await buscarPedidos(dataAtual);

    if (pedidos.length > 0) {
        console.log(`Pedidos recebidos para a data ${dataAtual}: ${JSON.stringify(pedidos)}`);
    } else {
        console.log(`Nenhum pedido encontrado para a data ${dataAtual}.`);
    }
}

// Agendamento diário às 02:00 AM
cron.schedule('* * * * *', () => {
    console.log('Iniciando a sincronização de pedidos às 02:00 AM');
    buscarPedidosDoDia();
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo" // Defina o fuso horário correto para sua região
});

console.log('Cron job configurado para rodar diariamente às 02:00 AM');
