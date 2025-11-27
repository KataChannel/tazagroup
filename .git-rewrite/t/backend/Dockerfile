# Multi-stage Dockerfile for NestJS Backend with Bun.js

# Bun development stage
FROM oven/bun:1.1.34 AS bun-development
WORKDIR /app
COPY package.json bun.json ./
COPY prisma ./prisma/
RUN bun install
COPY . .
RUN bunx prisma generate
EXPOSE 4000
CMD ["bun", "run", "start:dev"]

# Node.js development stage (fallback)
FROM node:22-alpine AS node-development
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=development
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "start:dev"]

# Bun build stage
FROM oven/bun:1.1.34 AS bun-build
WORKDIR /app
COPY package.json bun.json ./
COPY prisma ./prisma/
RUN bun install
COPY . .
RUN bunx prisma generate
RUN bun run build

# Node.js build stage (fallback)
FROM node:22-alpine AS node-build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=development
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm ci --only=production && npm cache clean --force

# Bun production stage
FROM oven/bun:1.1.34 AS bun-production
WORKDIR /app
COPY --from=bun-build /app/dist ./dist
COPY --from=bun-build /app/prisma ./prisma
COPY --from=bun-build /app/node_modules ./node_modules
COPY package.json bun.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run dist/health-check.js

CMD ["bun", "run", "start"]

# Node.js production stage (fallback)
FROM node:22-alpine AS node-production
WORKDIR /app
COPY --from=node-build /app/node_modules ./node_modules
COPY --from=node-build /app/dist ./dist
COPY --from=node-build /app/prisma ./prisma
COPY package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js

CMD ["npm", "run", "start:prod"]
