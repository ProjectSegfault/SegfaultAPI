FROM node:19-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm
RUN pnpm i

COPY . .

RUN pnpm build

ENV NODE_ENV=production

EXPOSE 6893

CMD [ "pnpm", "preview" ]