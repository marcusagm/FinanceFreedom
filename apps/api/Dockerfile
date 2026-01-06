FROM node:20-slim AS development

WORKDIR /usr/src/app
RUN apt-get update -y && apt-get install -y openssl procps

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma.config.ts ./
COPY src ./src
COPY prisma ./prisma

RUN npm install


# Generate Prisma client for build
RUN rm -rf node_modules/@prisma/client
RUN npx prisma generate

# Build the application
# RUN npm run build

CMD ["npm", "run", "start:prod"]
