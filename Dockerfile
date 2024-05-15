# Escolha a imagem base
FROM node:20.13.1

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o restante dos arquivos para o diretório de trabalho
COPY . /app

# Instalar o bun
RUN npm install -g bun

# Instale as dependências
RUN bun install

# Entre no diretorio do cliente (sisref-v2-dashboard-client)
WORKDIR /app/sisref-v2-dashboard-client

# Instale as dependências do cliente
RUN bun install

# Volte para o diretório de trabalho
WORKDIR /app

# Exponha a porta 3000
EXPOSE 3000

# Inicie o aplicativo
CMD ["bun", "dev"]
