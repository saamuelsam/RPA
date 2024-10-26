const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Caminho para o arquivo de credenciais JSON baixado do Google Cloud Console
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json'); 

// Função para autenticação na API do Google Sheets
async function autenticarGoogleSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH, // Chave de autenticação
        scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Escopo de acesso
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    return sheets;
}

module.exports = {
    autenticarGoogleSheets,
};
