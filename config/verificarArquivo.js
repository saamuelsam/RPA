const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const log = require('../utils/logger');

async function obterTokenDeAcesso() {
  // Utilize a função obterTokenDeAcesso de seu projeto em vez de token estático
  const accessToken = await obterTokenDeAcesso(); 
  return accessToken;
}

// Função para listar arquivos dentro de uma pasta no SharePoint
async function listarArquivosDaPasta() {
  const accessToken = await obterTokenDeAcesso();
  const siteId = '3a80689a-8ce0-4577-bf7b-ee4381097dc1'; // Site ID do SharePoint
  const driveId = 'b!mmiAOuCMd0W_e-5DgQl9wWVfIJ2rIK1MkSPIzi86-zeaaC8ebuvcTaqfImV_i6Jo'; // Drive ID
  const folderPath = '/Arquivo NFs, NPs e Boletos'; // Caminho da pasta

  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken); // Usa o token de acesso gerado
    }
  });

  try {
    log.info(`Tentando acessar a pasta no caminho: ${folderPath}`);
    
    const response = await client
      .api(`/sites/${siteId}/drives/${driveId}/root:${folderPath}:/children`)
      .get();

    const arquivos = response.value;
    log.info(`Arquivos encontrados na pasta: ${JSON.stringify(arquivos, null, 2)}`);

    if (arquivos.length === 0) {
      log.info('Nenhum arquivo encontrado na pasta especificada.');
    } else {
      arquivos.forEach(arquivo => {
        log.info(`Arquivo: ${arquivo.name} - Tamanho: ${arquivo.size} bytes`);
      });
    }

    return arquivos;

  } catch (error) {
    log.error(`Erro ao listar arquivos na pasta: ${error.message}`);
  }
}
