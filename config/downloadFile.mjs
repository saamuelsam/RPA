import obterTokenDeAcesso from './obterToken.mjs'; // Agora o export padrão está correto

async function baixarArquivo(nomeDoArquivo) {
  const token = await obterTokenDeAcesso();  // Obtenha o token de acesso atualizado
  const siteId = '3a80689a-8ce0-4577-bf7b-ee4381097dc1';  // Substitua pelo seu Site ID
  const driveId = 'b!mmiAOuCMd0W_e-5DgQl9wWVfIJ2rIK1MkSPIzi86-zeaaC8ebuvcTaqfImV_i6Jo';  // Substitua pelo seu Drive ID
  const folderPath = '/Arquivo NFs, NPs e Boletos'; // Caminho da pasta onde o arquivo está

  try {
    console.log(`Tentando baixar o arquivo: ${nomeDoArquivo}`);
    
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:${folderPath}/${nomeDoArquivo}:/content`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Usa o token no cabeçalho
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao baixar o arquivo: ${response.statusText}`);
    }

    const fileContent = await response.text(); // Ou .json(), dependendo do tipo de arquivo
    console.log('Arquivo baixado com sucesso:', fileContent);
    return fileContent;

  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error.message);
  }
}

// Exemplo de uso:
const nomeDoArquivo = 'ASSINANTES - GURU.xlsx';  // Nome do arquivo com a extensão
baixarArquivo(nomeDoArquivo);
