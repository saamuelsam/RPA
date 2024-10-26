// getSharePointContent.js
import { sp } from "@pnp/sp";
import { NodeFetchClient } from "@pnp/nodejs";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

sp.setup({
  sp: {
    fetchClientFactory: () => {
      console.log("Configurando autenticação com SharePoint...");
      return new NodeFetchClient(
        process.env.SHAREPOINT_CLIENT_ID,
        process.env.SHAREPOINT_CLIENT_SECRET,
        process.env.SHAREPOINT_TENANT_ID,
        process.env.SHAREPOINT_SITE_URL
      );
    },
    baseUrl: process.env.SHAREPOINT_SITE_URL,
  },
});

// Função para verificar conexão
export async function verificarConexao() {
  try {
    const web = await sp.web();
    console.log("Conexão estabelecida com sucesso:", web);
  } catch (error) {
    console.error("Erro ao conectar com o SharePoint:", error);
  }
}

// Função para baixar arquivo do SharePoint
export async function baixarArquivoDoSharePoint(nomeArquivo, caminhoLocal) {
  try {
    console.log("Iniciando a busca no SharePoint...");
    const biblioteca = process.env.SHAREPOINT_DOCUMENT_LIBRARY || "Documentos";
    console.log(`Buscando o arquivo ${nomeArquivo} na biblioteca ${biblioteca}...`);

    // Caminho completo para o arquivo no SharePoint
    const arquivoUrl = `${biblioteca}/${nomeArquivo}`;

    console.log(`Tentando acessar o arquivo: ${arquivoUrl}`);
    const file = await sp.web.getFileByServerRelativeUrl(arquivoUrl).getBuffer();

    fs.writeFileSync(caminhoLocal, file);
    console.log(`Arquivo ${nomeArquivo} baixado e salvo em ${caminhoLocal}.`);
  } catch (error) {
    console.error("Erro ao baixar o arquivo do SharePoint:", error);
    throw error;
  }
}
