FROM node:19-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm i -g pnpm
RUN pnpm i

COPY . .

RUN pnpm build

EXPOSE 6893

CMD [ "pnpm", "preview" ]