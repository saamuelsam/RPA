const axios = require('axios');
const qs = require('qs');

// Configurações do aplicativo
const tenantId = process.env.TENANT_ID || '74ca36cd-8cdb-4647-b46d-03042680829c'; // Seu Tenant ID
const clientId = process.env.CLIENT_ID || '78d4a8a2-8dc8-4346-a0c5-de3ca1fa7d5e'; // Seu Client ID
const clientSecret = process.env.CLIENT_SECRET || 'cfY8Q~bnOpB-_qVrWq~kChhuTZmeNifUuHZ_ga_j'; // Seu Client Secret
const scope = 'https://graph.microsoft.com/.default'; // Escopo da API

// Função para obter o token de acesso
async function obterTokenDeAcesso() {
  // Verifica se as variáveis de ambiente estão definidas
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('As variáveis TENANT_ID, CLIENT_ID ou CLIENT_SECRET não estão definidas.');
  }

  const data = qs.stringify({
    grant_type: 'client_credentials',
    client_id: clientId, // Reutilizando as variáveis definidas acima
    client_secret: clientSecret, // Reutilizando as variáveis definidas acima
    scope: scope // Reutilizando a variável escopo
  });

  try {
    const response = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const token = response.data.access_token;
    console.log('Token de Acesso:', token);
    return token;
  } catch (error) {
    console.error('Erro ao obter o token:', error.response ? error.response.data : error.message);
    throw error; // Propaga o erro
  }
}

module.exports = obterTokenDeAcesso;
