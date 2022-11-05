# SegfaultAPI
Web utilities and APIs for Project Segfault, written in TypeScript with express.

## What does it do?
It powers our website's contact form, announcements and instances page.

## Setup

### Docker
```
docker-compose --env-file .my-env  up -d
```
You need to make a .env file with the values in .env.example in the current directory for the container to use.

We recommend using Docker as it provides better security (we suck in security, so that's why) and we are constantly updating SegfaultAPI. Docker makes it easy to update the program.

If you're using Portainer, you should know how to add SegfaultAPI.

### Manual (recommended for development)
```
git clone https://github.com/ProjectSegfault/SegfaultAPI
cd SegfaultAPI/
pnpm i # or pnpm i --production if you don't plan on developing
pnpm build
pnpm preview
```