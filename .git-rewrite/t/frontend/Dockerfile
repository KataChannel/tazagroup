# Multi-stage Dockerfile for Next.js Frontend with Bun.js

# Bun dependencies stage
FROM oven/bun:1.1.34 AS bun-deps
WORKDIR /app
COPY package.json bun.json ./
RUN bun install --frozen-lockfile

# Node.js dependencies stage (fallback)
FROM node:22-alpine AS node-deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile

# Bun build stage
FROM oven/bun:1.1.34 AS bun-builder
WORKDIR /app
COPY --from=bun-deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun --bun next build

# Node.js build stage (fallback)
FROM node:22-alpine AS node-builder
WORKDIR /app
COPY --from=node-deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Bun production stage
FROM oven/bun:1.1.34 AS bun-production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=bun-builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=bun-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=bun-builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run health-check.js

CMD ["bun", "run", "server.js"]

# Node.js production stage (fallback)
FROM node:22-alpine AS node-production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=node-builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=node-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=node-builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node health-check.js

CMD ["node", "server.js"]
