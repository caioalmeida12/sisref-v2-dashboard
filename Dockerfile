# Escolha a imagem base
FROM node:22-alpine

# Verificar a versão do Node.js
RUN node -v

# Verificar a versão do npm
RUN npm -v

# Instalar o curl
RUN apk add --no-cache curl

# Instalar o bash
RUN apk add --no-cache bash

# Verificar a versão do curl
RUN curl --version

# Verificar a versão do bash
RUN bash --version

# Criar um diretório de trabalho
WORKDIR /app

# Copiar o arquivo package.json
COPY package.json .

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos
COPY . .

# Entrar na pasta sisref-v2-dashboard-client
WORKDIR /app/sisref-v2-dashboard-client

# Instalar as dependências
RUN npm install

# Expor a porta 3000
EXPOSE 3000

# Iniciar a aplicação
CMD ["npx", "next"]