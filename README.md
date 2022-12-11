# SegfaultAPI

Web utilities and APIs for Project Segfault, written in TypeScript with Fastify and MongoDB.

## What does it do?

It powers our website's contact form, announcements and instances page.

## Setup

### Docker

```
docker compose up -d
```

We recommend using Docker as it provides better security (we suck in security, so that's why) and we are constantly updating SegfaultAPI. Docker makes it easy to update the program.

You should add `MONGO_USER` and `MONGO_PASSWORD` to your environment as well as make a config.yml file with the values in config/config.example.yml and mount it in your host system if you want to.

If you're using Portainer, you should know how to add SegfaultAPI.

### Manual (recommended for development)

```
git clone https://github.com/ProjectSegfault/SegfaultAPI
cd SegfaultAPI/
pnpm i # or pnpm i --production if you don't plan on developing
pnpm preview # or pnpm dev if you plan on developing
```
