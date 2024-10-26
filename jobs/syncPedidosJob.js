const { buscarPedidos } = require('../config/tinyERP');
const { lerPlanilha, adicionarCliente } = require('../services/sheetsService');
const { verificarCep, determinarDiaDeEntrega } = require('../controllers/regrasController');
const log = require('../utils/logger');
const { processarPlanilhaGuru } = require('../services/processarPlanilhaGuru'); // Adiciona a função para processar a planilha GURU

// Função para obter a data atual no formato 'yyyy-mm-dd'
function obterDataAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoje.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

async function syncPedidos() {
    try {
        const dataEmissao = obterDataAtual(); // Usando a data atual
        log(`Iniciando sincronização para a data: ${dataEmissao}`);

        const pedidos = await buscarPedidos(dataEmissao);
        
        // Log detalhado do primeiro pedido para ajudar na inspeção
        if (pedidos && pedidos.length > 0) {
            log(`Pedidos recebidos: ${JSON.stringify(pedidos, null, 2)}`);
        } else {
            log('Nenhum pedido encontrado ou erro na resposta da API.');
            return;
        }

        // Filtrar pedidos pela data de emissão
        const pedidosFiltrados = pedidos.filter(pedido => pedido.pedido.data_pedido === dataEmissao);

        if (pedidosFiltrados.length === 0) {
            log(`Nenhum pedido filtrado encontrado para a data atual: ${dataEmissao}.`);
            return;
        }

        log(`Pedidos filtrados para a data atual: ${JSON.stringify(pedidosFiltrados, null, 2)}`);

        // Ler dados existentes na planilha
        const clientesExistentes = await lerPlanilha('Planilha1!A1:E'); // Ajuste o intervalo se necessário
        log(`Clientes existentes na planilha: ${JSON.stringify(clientesExistentes, null, 2)}`);

        for (const pedido of pedidosFiltrados) {
            if (!pedido.pedido || !pedido.pedido.cliente || !pedido.pedido.cliente.cpf || !pedido.pedido.cliente.endereco) {
                log(`Pedido com dados incompletos. Ignorando... Pedido: ${JSON.stringify(pedido, null, 2)}`);
                continue; // Pula pedidos com dados incompletos
            }

            const clienteCpf = pedido.pedido.cliente.cpf;
            log(`Processando pedido do cliente ${pedido.pedido.cliente.nome}. CPF: ${clienteCpf}`);

            // Verificar se o cliente já está na planilha
            const clienteJaExiste = clientesExistentes.some(row => row.includes(clienteCpf));

            if (!clienteJaExiste) {
                const clienteCep = pedido.pedido.cliente.cep;
                log(`Verificando CEP: ${clienteCep}`);
                
                const cepValido = verificarCep(clienteCep);
                log(`CEP ${clienteCep} é válido: ${cepValido}`);

                if (!cepValido) {
                    log(`CEP ${clienteCep} não está na lista de entregas.`);
                    continue; // Pula o pedido se o CEP não for válido
                }

                const clienteBairro = pedido.pedido.cliente.endereco.bairro;
                log(`Determinando dia de entrega para o bairro: ${clienteBairro}`);
                const diaDeEntrega = determinarDiaDeEntrega(clienteBairro);

                const clienteData = {
                    nome: pedido.pedido.cliente.nome,
                    cpf: clienteCpf,
                    endereco: pedido.pedido.cliente.endereco,
                    cep: clienteCep,
                    diaEntrega: diaDeEntrega,
                };

                await adicionarCliente(clienteData);
                log(`Cliente ${clienteData.nome} adicionado à planilha com entrega prevista para ${diaDeEntrega}.`);
            } else {
                log(`Cliente ${pedido.pedido.cliente.nome} já existe na planilha.`);
            }
        }

        // Processar a planilha GURU após a sincronização dos pedidos
        log(`Iniciando o processamento da planilha GURU...`);
        const arquivoGuruUrl = "https://organicosdafatima.sharepoint.com/sites/Diretoria/_layouts/15/download.aspx?UniqueId=e77eef3e-6096-4396-933f-b678312834cd&Translate=false&tempauth=..."; // Insira a URL completa
        await processarPlanilhaGuru(arquivoGuruUrl); // Função que baixa e processa a planilha
        log('Processamento da planilha GURU concluído.');

    } catch (error) {
        // Log detalhado do erro, diferenciando entre erro de API e erro geral
        if (error.response) {
            log(`Erro na API ao buscar pedidos: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            log(`Erro geral na sincronização dos pedidos: ${JSON.stringify(error, null, 2)}`);
        }
    }
}

module.exports = syncPedidos;
