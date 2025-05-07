FROM node:18-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos de configuración necesarios para instalar dependencias correctamente
COPY package*.json tsconfig.json ./

# Instala todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copia el resto del código fuente
COPY . .

# Comando para iniciar el backend en desarrollo con ts-node-dev
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/index.ts"]

