const axios = require('axios');
const log = require('./utils/logger'); // Importando o logger
const fs = require('fs');
const path = require('path');

// Função para obter o token de acesso
async function obterTokenDeAcesso() {
  // [O código para obter o token permanece o mesmo]
}

// Função para acessar os dados do SharePoint
async function obterDadosDoSharePoint() {
  try {
    const accessToken = await obterTokenDeAcesso();
    if (!accessToken) {
      throw new Error('Token de acesso é inválido ou não foi obtido.');
    }

    const siteId = 'organicosdafatima.sharepoint.com,3a80689a-8ce0-4577-bf7b-ee4381097dc1,9d205f65-20ab-4cad-9123-c8ce2f3afb37';
    const folderId = '01KXR56CJ7OGZFATTNABDIFBOWDGLKQJ2A'; // ID da pasta específica

    log.info(`Tentando acessar o site com ID: ${siteId}`);
    log.info(`Tentando acessar a pasta com ID: ${folderId}`);

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${folderId}/children`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          '$select': 'id,name,webUrl,@microsoft.graph.downloadUrl', // Incluindo a propriedade downloadUrl
        },
      }
    );

    if (response.data && response.data.value) {
      log.info(`Dados do SharePoint obtidos. Total de itens: ${response.data.value.length}`);
    } else {
      log.info('Nenhum dado retornado do SharePoint.');
    }

    // Processar os itens para extrair as informações necessárias
    const arquivos = response.data.value.map((item) => ({
      id: item.id,
      name: item.name,
      webUrl: item.webUrl,
      downloadUrl: item['@microsoft.graph.downloadUrl'], // Acessando a URL de download
    }));

    return arquivos; // Retorna a lista de arquivos com as URLs de download
  } catch (error) {
    log.error(`Erro ao acessar SharePoint: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    log.error('Verifique se o siteId e folderId estão corretos.');
    throw new Error('Erro ao acessar o SharePoint.');
  }
}

// Função para baixar os arquivos utilizando as URLs de download
async function baixarArquivos() {
  try {
    const arquivos = await obterDadosDoSharePoint();

    for (const arquivo of arquivos) {
      // Evitar logar a downloadUrl por questões de segurança
      log.info(`Baixando arquivo: ${arquivo.name}`);

      const response = await axios.get(arquivo.downloadUrl, {
        responseType: 'stream',
      });

      // Definir o caminho onde o arquivo será salvo
      const filePath = path.join(__dirname, 'downloads', arquivo.name);

      // Garantir que o diretório existe
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      // Criar um stream para escrever o arquivo
      const writer = fs.createWriteStream(filePath);

      // Pipe da resposta para o stream de escrita
      response.data.pipe(writer);

      // Retornar uma promessa que será resolvida quando o download for concluído
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      log.info(`Arquivo "${arquivo.name}" baixado com sucesso.`);
    }

    log.info('Todos os arquivos foram baixados.');
  } catch (error) {
    log.error(`Erro ao baixar arquivos: ${error.message}`);
  }
}

// Executar a função para baixar os arquivos
baixarArquivos();
