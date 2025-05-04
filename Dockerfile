FROM node:18-slim


WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "ts-node-dev", "--respawn", "src/index.ts"]
