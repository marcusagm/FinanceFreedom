FROM node:20-slim AS development

WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl procps

# Copy root config
COPY package.json package-lock.json ./
# Copy app specific config
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN npm install

# Copy source
COPY apps/api ./apps/api

# Set working directory to api
WORKDIR /app/apps/api

# Generate Prisma client
RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
