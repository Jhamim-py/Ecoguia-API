FROM node:20.16.0

ENV dotenv=production

WORKDIR /api

COPY . .

RUN rm -rf node_modules
RUN npm install --production

EXPOSE 3000

CMD [ "npm", "start" ]
