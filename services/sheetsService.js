const { obterTokenMicrosoftGraph } = require('../config/microsoftGraph');
const axios = require('axios');

// URL direta do arquivo no SharePoint
const FILE_URL = 'https://organicosdafatima.sharepoint.com/sites/Diretoria/_layouts/15/Doc.aspx?sourcedoc=%7BE77EEF3E-6096-4396-933F-B678312834CD%7D&file=ASSINANTES%20-%20GURU.xlsx&action=default&mobileredirect=true';

// Função para baixar e processar a planilha
async function lerPlanilhaSharePoint() {
  const token = await obterTokenMicrosoftGraph();

  try {
    const response = await axios.get(FILE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'arraybuffer', // Para baixar o arquivo como buffer
    });

    // Aqui você pode processar o arquivo com alguma biblioteca como o 'XLSX'
    const XLSX = require('xlsx');
    const workbook = XLSX.read(response.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const dados = XLSX.utils.sheet_to_json(sheet);
    console.log(dados);

    return dados;
  } catch (error) {
    console.error('Erro ao acessar o arquivo no SharePoint:', error.message);
  }
}

module.exports = {
  lerPlanilhaSharePoint,
};
