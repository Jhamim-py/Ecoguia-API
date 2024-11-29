FROM node:20.16.0

ENV dotenv=production

WORKDIR /api

# Copiar todos os arquivos para o contêiner
COPY . .

# Instalar dependências
RUN rm -rf node_modules
RUN npm install --production

# Expor a porta da aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]