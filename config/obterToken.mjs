import fetch from 'node-fetch'; 

async function obterTokenDeAcesso() {
  const tenantId = '74ca36cd-8cdb-4647-b46d-03042680829c';
  const clientId = '78d4a8a2-8dc8-4346-a0c5-de3ca1fa7d5e';
  const clientSecret = 'cfY8Q~bnOpB-_qVrWq~kChhuTZmeNifUuHZ_ga_j';
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('grant_type', 'client_credentials');

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const data = await response.json();

    if (data.access_token) {
      console.log('Token de Acesso:', data.access_token);
      return data.access_token; // Retorna o token de acesso
    } else {
      throw new Error(`Erro ao obter token: ${data.error_description || 'desconhecido'}`);
    }
  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error.message);
  }
}

export default obterTokenDeAcesso;
