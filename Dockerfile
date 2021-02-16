#FROM node:12.18.2
FROM arm32v6/node:10.23-alpine

ENV ENV prod

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]