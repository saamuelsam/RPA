const axios = require('axios');
const obterTokenDeAcesso = require('./getAccessToken'); // Certifique-se de que o caminho está correto

async function obterDadosDoSharePoint() {
  try {
    const accessToken = await obterTokenDeAcesso();

    // Verificar se o token foi obtido corretamente
    if (!accessToken) {
      throw new Error('Token de acesso não obtido. Verifique as credenciais.');
    }

    // IDs corretos do site e do drive
    const siteId = '3a80689a-8ce0-4577-bf7b-ee4381097dc1';  // Site ID real
    const driveId = 'b!mmiAOuCMd0W_e-5DgQl9wWVfIJ2rIK1MkSPIzi86-zeaaC8ebuvcTaqfImV_i6Jo';  // ID do Drive/Biblioteca de documentos
    const itemPath = '/Arquivo NFs, NPs e Boletos'; // Caminho da pasta dentro da biblioteca

    // URL e headers configurados separadamente para facilitar a manutenção
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:${itemPath}:/children`;
    const headers = { 
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // Faz a requisição para obter os arquivos
    const response = await axios.get(url, { headers });

    // Verifica se a resposta contém dados
    if (!response.data || !response.data.value) {
      throw new Error('Nenhum dado foi retornado da API do SharePoint.');
    }

    // Retorne os arquivos obtidos
    return response.data.value;

  } catch (error) {
    // Opção para logar o erro para debugging
    console.error('Erro ao acessar conteúdo do SharePoint:', error);

    // Lança um erro mais descritivo
    throw new Error(`Erro ao acessar conteúdo da pasta: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
  }
}

module.exports = obterDadosDoSharePoint;
