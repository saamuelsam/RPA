const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

// IDs e segredos obtidos do Azure AD
const clientId = process.env.CLIENT_ID;  // Armazene as variáveis no .env
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;
const sharepointSite = 'organicosdafatima.sharepoint.com';  // O domínio do SharePoint
const siteId = 'diretoria';  // O ID do site SharePoint onde o arquivo está localizado
const filePath = 'Documentos Compartilhados/ASSINANTES - GURU.xlsx'; // Caminho do arquivo dentro do SharePoint

// Função para obter o token de acesso
async function getAccessToken() {
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'https://graph.microsoft.com/.default'
    })
  });

  const data = await response.json();
  return data.access_token;
}

// Função para buscar o arquivo Excel
async function getExcelFile() {
  const accessToken = await getAccessToken();

  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  try {
    // Buscando o site para obter o siteId correto
    const site = await client.api(`/sites/${sharepointSite}:/sites/${siteId}`).get();
    
    // Usando siteId e filePath corretamente na API do Microsoft Graph
    const file = await client.api(`/sites/${site.id}/drive/root:/${filePath}:/content`).get();
    
    console.log(file);
  } catch (error) {
    console.error("Erro ao buscar o arquivo:", error);
  }
}

module.exports = { getExcelFile };
