FROM node:20.16.0

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Instalar dependências do sistema para o Chromium
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Instalar dependências do projeto
WORKDIR /api

COPY . .

RUN rm -rf node_modules
RUN npm install --production

# Expor a porta
EXPOSE 3000

# Iniciar a aplicação
CMD [ "npm", "start" ]