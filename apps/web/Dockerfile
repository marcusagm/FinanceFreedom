FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY index.html ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY src ./src
COPY public ./public
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY components.json ./

# Install defaults if missing
RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]
