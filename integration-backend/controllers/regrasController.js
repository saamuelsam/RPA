// Exemplo de lista de CEPs válidos para entrega
const listaCepValido = [
  '01000-000', '02000-000', '03000-000', // Exemplos
];

// Exemplo de regras de entrega por bairro
const regrasDeEntrega = {
  'Centro': 'Segunda-feira',
  'Zona Norte': 'Terça-feira',
  'Zona Sul': 'Quarta-feira',
};

// Função para verificar se o CEP está na lista de entregas
function verificarCep(cep) {
  return listaCepValido.includes(cep);
}

// Função para determinar o dia de entrega com base no bairro
function determinarDiaDeEntrega(bairro) {
  return regrasDeEntrega[bairro] || 'Indeterminado';
}

module.exports = {
  verificarCep,
  determinarDiaDeEntrega,
};
