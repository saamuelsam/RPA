const axios = require('axios');
const obterTokenDeAcesso = require('../getAccessToken'); // Certifique-se de que o caminho está correto

async function acessarConteudoPasta() {
  try {
    const accessToken = await obterTokenDeAcesso();
    
    // IDs corretos do site e do drive
    const siteId = '3a80689a-8ce0-4577-bf7b-ee4381097dc1';  // Site ID real
    const driveId = 'b!mmiAOuCMd0W_e-5DgQl9wWVfIJ2rIK1MkSPIzi86-zeaaC8ebuvcTaqfImV_i6Jo';  // ID do Drive/Biblioteca de documentos
    const itemPath = '/Arquivo%20NFs,%20NPs%20e%20Boletos'; // Caminho da pasta codificado

    const config = {
      method: 'get',
      url: `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:${itemPath}:/children`, // Acessa a pasta específica e lista os itens
      headers: { 
        'Authorization': `Bearer ${accessToken}` 
      }
    };

    const response = await axios(config);
    console.log('Conteúdo da pasta:', response.data);
  } catch (error) {
    console.error('Erro ao acessar conteúdo da pasta:', error.response ? error.response.data : error.message);
  }
}

acessarConteudoPasta();
