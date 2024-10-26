// planilhaUtils.js
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { baixarArquivoDoSharePoint } = require('../../getFileFromSharePoint'); // Importa o método para baixar arquivos

// Função para verificar se o arquivo existe localmente (opcional)
function verificarArquivo(caminhoArquivo) {
  return fs.existsSync(caminhoArquivo);
}

// Função para baixar a planilha do SharePoint
async function baixarPlanilhaDoSharePoint(caminhoLocal) {
  try {
    // Baixa o arquivo do SharePoint e salva no caminho especificado
    await baixarArquivoDoSharePoint('assinantes.xlsx', caminhoLocal);
    console.log('Planilha baixada com sucesso do SharePoint.');
  } catch (error) {
    console.error('Erro ao baixar a planilha do SharePoint:', error);
  }
}

// Função para ler a planilha e obter os dados
async function lerPlanilha(caminhoArquivo) {
  try {
    await baixarPlanilhaDoSharePoint(caminhoArquivo); // Garante que sempre baixa a planilha atualizada

    const workbook = xlsx.readFile(caminhoArquivo);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dados = xlsx.utils.sheet_to_json(sheet);
    return dados;
  } catch (error) {
    console.error('Erro ao ler a planilha:', error);
    return [];
  }
}

// Função para atualizar a planilha localmente (opcional)
function atualizarPlanilha(caminhoArquivo, dadosAtualizados) {
  if (!verificarArquivo(caminhoArquivo)) {
    console.error(`Erro: O arquivo ${caminhoArquivo} não foi encontrado para atualizar.`);
    return;
  }

  try {
    const workbook = xlsx.readFile(caminhoArquivo);
    const sheetName = workbook.SheetNames[0];
    const newSheet = xlsx.utils.json_to_sheet(dadosAtualizados);
    workbook.Sheets[sheetName] = newSheet;
    xlsx.writeFileSync(workbook, caminhoArquivo); // Utilizando writeFileSync para garantir a escrita correta
    console.log('Planilha atualizada com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar a planilha:', error);
  }
}

module.exports = {
  lerPlanilha,
  atualizarPlanilha,
};
