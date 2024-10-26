# Usar imagem base do Node.js
FROM node:14

# Criar diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código
COPY . .

# Expor a porta (caso haja interface de API)
EXPOSE 3000

# Comando para rodar o app
CMD ["npm", "start"]
