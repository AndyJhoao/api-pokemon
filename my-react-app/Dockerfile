FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias primero (mejor cache)
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Variable de entorno para la URL del API (se pasa en build time)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build de producción
RUN npm run build

# Imagen final ligera
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

# Render define el puerto via variable de entorno
ENV PORT=3000
EXPOSE ${PORT}

CMD ["sh", "-c", "serve -s dist -l tcp://0.0.0.0:${PORT}"]