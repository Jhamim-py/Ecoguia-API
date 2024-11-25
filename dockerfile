FROM node:20.12.2

ENV NODE_ENV=production

WORKDIR /api

COPY . .

RUN rm -rf node_modules
RUN npm i --production

CMD [ "npm", "start" ]

EXPOSE 3000