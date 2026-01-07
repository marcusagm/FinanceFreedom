FROM node:20-alpine

WORKDIR /app

# Copy root config
COPY package.json package-lock.json ./
# Copy app specific config
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm install

# Copy source
COPY apps/web ./apps/web

# Set working directory to web
WORKDIR /app/apps/web

CMD ["npm", "run", "dev", "--", "--host"]
