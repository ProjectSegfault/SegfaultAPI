FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json /usr/src/app/
RUN pnpm install --force

# Copying source files
COPY . /usr/src/app

# Building app
RUN pnpm build
EXPOSE 6893

# Running the app
CMD [ "pnpm", "preview" ]