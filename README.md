# SegfaultAPI
Web utilities and APIs for Project Segfault, written in TypeScript with express.

## What does it do?
It powers our website's contact form, announcements and instances page.

## Setup

### Docker
```
docker run -d --restart=always -p 6893:6893 --name segfaultapi -v "$(pwd)"/data:/segfaultapi/data projectsegfault/segfaultapi:latest
```
You need to rename the ``config.example.json`` to ```config.json`` and customize the values in the config file.

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