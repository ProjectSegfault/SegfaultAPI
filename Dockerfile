FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm i -g pnpm
RUN pnpm i

COPY . .

ENV NODE_ENV=production

EXPOSE 6893

CMD [ "pnpm", "preview" ]