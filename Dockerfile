FROM node:19-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i

COPY . .

EXPOSE 6893

CMD [ "npx", "tsx", "./src/index.ts" ]