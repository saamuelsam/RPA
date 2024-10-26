const mysql = require('mysql2/promise');

// Configurações do banco de dados
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'meu_banco',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Função para converter a data de 'DD/MM/YYYY' para 'YYYY-MM-DD'
function converterData(data) {
  if (!data) {
    console.log("Data não encontrada:", data);
    return null; // Retorna null se a data for indefinida ou nula
  }

  const [dia, mes, ano] = data.split('/');
  if (!dia || !mes || !ano) {
    console.log("Formato de data incorreto:", data);
    return null;
  }
  return `${ano}-${mes}-${dia}`;
}

// Função para garantir que todos os valores estejam definidos ou sejam nulos
function tratarValores(value, valorPadrao = null) {
  return value === undefined || value === null ? valorPadrao : value;
}

// Função para salvar um pedido no banco de dados
async function savePedido(pedido) {
  console.log("Salvando pedido:", pedido); // Log do pedido completo para verificar os valores

  const query = `
        INSERT INTO pedidos (numero, cliente, total, dataEmissao, status)
        VALUES (?, ?, ?, ?, ?)
    `;

  const dataFormatada = tratarValores(converterData(pedido.dataEmissao), null);
  
  // Verificação e logs adicionais para garantir que estamos processando a data corretamente
  if (!dataFormatada) {
    console.error("Erro: dataEmissao inválida ou ausente no pedido", pedido);
    return; // Não tenta salvar o pedido se a data estiver ausente ou inválida
  }

  const values = [
    tratarValores(pedido.numero, 'Desconhecido'), // Atribui "Desconhecido" se o valor for null
    tratarValores(pedido.cliente, 'Cliente Desconhecido'), // Atribui "Cliente Desconhecido" se o valor for null
    tratarValores(pedido.total, 0), // Atribui 0 se o valor for null
    dataFormatada, // Data já formatada corretamente
    tratarValores(pedido.status, 'Novo') // Atribui "Novo" se o valor for null
  ];

  try {
    const [result] = await pool.execute(query, values);
    console.log('Pedido salvo com sucesso:', result.insertId);
  } catch (error) {
    console.error('Erro ao salvar o pedido:', error.message);
    console.error('Query executada:', query);
    console.error('Valores fornecidos:', values);
  }
}


module.exports = {
  savePedido,
};
