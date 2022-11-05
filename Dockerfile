FROM node:19-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 6893

CMD [ "node", "dist/index.js" ]