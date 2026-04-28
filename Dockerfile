# Use Node.js LTS as base
FROM node:20-slim AS base

# Install build dependencies if needed
# RUN apt-get update \u0026\u0026 apt-get install -y python3 make g++ \u0026\u0026 rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root configurations
COPY package*.json tsconfig.json ./

# Copy shared packages
COPY shared/ ./shared/

# Copy all services
COPY services/ ./services/

# Install dependencies for the whole monorepo
RUN npm install

# Build the shared types package first
RUN npm run build -w @shared/types

# --- SERVICE BUILD STAGE ---
FROM base AS builder
ARG SERVICE_NAME
RUN npm run build -w $SERVICE_NAME

# --- PRODUCTION STAGE ---
FROM node:20-slim AS runner
WORKDIR /app
ARG SERVICE_NAME
ENV NODE_ENV=production

# Copy built artifacts and necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/$SERVICE_NAME/dist ./services/$SERVICE_NAME/dist
COPY --from=builder /app/services/$SERVICE_NAME/package.json ./services/$SERVICE_NAME/package.json
COPY --from=builder /app/shared/types/dist ./shared/types/dist
COPY --from=builder /app/shared/types/package.json ./shared/types/package.json

# Set working directory to the service
WORKDIR /app/services/$SERVICE_NAME

# Default port - will be overridden by environment
EXPOSE 3000

CMD ["node", "dist/server.js"]
