# ============================================================================
# TAZAGROUP Frontend Dockerfile - Fresh Build (No Cache)
# Builds directly to .next with latest code changes every time
# ============================================================================

# ===== STAGE 1: DEPENDENCIES =====
FROM oven/bun:1.3-alpine AS deps
WORKDIR /app

# Install ALL dependencies (including devDependencies for build)
COPY frontend/package.json frontend/bun.lockb* ./
RUN bun install --frozen-lockfile

# ===== STAGE 2: BUILDER =====
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app

# Copy package.json first
COPY frontend/package.json ./

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code (excluding node_modules via .dockerignore)
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/next.config.js ./
COPY frontend/tsconfig.json ./
COPY frontend/tailwind.config.ts* ./
COPY frontend/postcss.config.js* ./
COPY frontend/middleware.ts* ./
COPY frontend/components.json* ./

# Set build environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application (generates .next directory with latest code)
RUN bun run build

# ===== STAGE 3: PRODUCTION RUNTIME =====
FROM node:22-alpine AS runtime

# Install minimal runtime dependencies
RUN apk add --no-cache curl dumb-init && \
    rm -rf /var/cache/apk/* && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs --ingroup nodejs

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static/ ./frontend/.next/static/
COPY --from=builder --chown=nextjs:nodejs /app/public/ ./frontend/public/

# Switch to non-root user for security
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "frontend/server.js"]
